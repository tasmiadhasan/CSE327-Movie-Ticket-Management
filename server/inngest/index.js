import sendEmail from "../configs/nodeMailer.js";
import Booking from "../models/booking.js";
import Show from "../models/show.js";
import User from "../models/user.js";
import Notify from "../models/notify.js";
import { Inngest } from "inngest";



export const inngest = new Inngest({ id: "movie-ticket-booking" });

//Inngest Functions to save user data to a database

const syncUserCreation = inngest.createFunction(
    {id: 'sync-user-from-clerk'},
    { event: 'clerk/user.created' },
    async ({ event })=>{
        const {id, first_name, last_name, email_addresses, image_url} = event.data
        const userData = {
            _id: id,
            name:first_name + ' ' + last_name ,
            email: email_addresses[0].email_address,
            image: image_url
        }
        await User.create(userData)
    
        
    }
)

//Inngest function to delete user from database

const syncUserDeletion = inngest.createFunction(
    {id: 'delete-user-from-clerk'},
    { event: 'clerk/user.deleted' },
    async ({ event })=>{
        
    const {id} = event.data
    await User.findByIdAndDelete(id)
        
    }
)


//update


const syncUserUpdation = inngest.createFunction(
    {id: 'update-user-from-clerk'},
    { event: 'clerk/user.updated' },
    async ({ event })=>{
        
    const {id, first_name, last_name, email_addresses, image_url} = event.data
    const userData = {
            _id: id,
            name:first_name + ' ' + last_name ,
            email: email_addresses[0].email_address,
            image: image_url
        }

        await User.findByIdAndUpdate(id, userData);
    }
)

const releaseSeatsAndDeleteBooking = inngest.createFunction(
    {id: 'release-seats-delete-booking'},
    {event: "app/checkpayment"},
    async ({ event, step })=>{
        const tenMinutesLater = new Date(Date.now() + 10 * 60 * 1000);
        await step.sleepUntil('wait-for-10-minutes', tenMinutesLater);

        await step.run('check-payment-status', async ()=>{
            const bookingId = event.data.bookingId;
            const booking = await Booking.findById(bookingId);

           if(!booking.isPaid){
    const show = await Show.findById(booking.show);
    booking.bookedSeats.forEach((seat)=>{
        delete show.occupiedSeats[seat]
    });
    show.markModified('occupiedSeats')
    await show.save()
    await Booking.findByIdAndDelete(booking._id)
           } 
        })
    }
)


const sendBookingConfirmationEmail = inngest.createFunction(
    {id: "send-booking-confirmation-email"},
    {event: "app/show.booked"},
    async ({ event, step })=>{
        const { bookingId } = event.data;

        const booking = await Booking.findById(bookingId).populate({
            path: 'show',
            populate: {path: "movie", model: "Movie"}
        }).populate('user');
        
        await sendEmail({
    to: booking.user.email,
    subject: `Payment Confirmation: "${booking.show.movie.title}" booked!`,
    body: `<div style="font-family: Arial, sans-serif; line-height: 1.5;">
        <h2>Hi ${booking.user.name},</h2>
        <p>Your booking for <strong style="color: #F84565;">${booking.show.movie.title}</strong> is confirmed.</p>
        <p>
            <strong>Date:</strong> ${new Date(booking.show.showDateTime).toLocaleDateString('en-US', { timeZone: 'Asia/Kolkata' })}<br/>
            <strong>Time:</strong> ${new Date(booking.show.showDateTime).toLocaleTimeString('en-US', { timeZone: 'Asia/Kolkata' })}
        </p>
        <p>Enjoy the show! 🍿</p>
        <p>Thanks for booking with us!<br/>— QuickShow Team</p>
    </div>`
})

    }
)

const sendShowReminders = inngest.createFunction(
  {id: "send-show-reminders"},
  { cron: "0 */8 * * *" }, // Every 8 hours
  async ({ step })=>{
    const now = new Date();
    const in8Hours = new Date(now.getTime() + 8 * 60 * 60 * 1000);
    const windowStart = new Date(in8Hours.getTime() - 10 * 60 * 1000);

    const reminderTasks = await step.run("prepare-reminder-tasks", async ()=>{
      const shows = await Show.find({
        showTime: { $gte: windowStart, $lte: in8Hours },
      }).populate('movie');

      const tasks = [];

      for(const show of shows){
        if(!show.movie || !show.occupiedSeats) continue;

        const userIds = [...new Set(Object.values(show.occupiedSeats))];
        if(userIds.length === 0) continue;

        const users = await User.find({_id: {$in: userIds}}).select("name email");

        for(const user of users){
          tasks.push({
            userEmail: user.email,
            userName: user.name,
            movieTitle: show.movie.title,
            showTime: show.showTime,
          });
        }
      }
      return tasks;
    });

    if(reminderTasks.length === 0){
      return {sent: 0, message: "No reminders to send."};
    }

    // Send reminder emails
    const results = await step.run('send-all-reminders', async ()=>{
      return await Promise.allSettled(
        reminderTasks.map(task => sendEmail({
          to: task.userEmail,
          subject: `Reminder: Your movie "${task.movieTitle}" starts soon!`,
          body: `<div style="font-family: Arial, sans-serif; padding: 20px;">
            <h2>Hello ${task.userName},</h2>
            <p>This is a quick reminder that your movie:</p>
            <h3 style="color: #F84565;">"${task.movieTitle}"</h3>
            <p>
              is scheduled for <strong>${new Date(task.showTime).toLocaleDateString('en-US', { timeZone: 'Asia/Kolkata' })}</strong> at
              <strong>${new Date(task.showTime).toLocaleTimeString('en-US', { timeZone: 'Asia/Kolkata' })}</strong>.
            </p>
            <p>It starts in approximately <strong>8 hours</strong> - make sure you're ready!<br/>Enjoy the show!<br/>QuickShow Team</p>
          </div>`
        }))
      );
    });

    const sent = results.filter(r => r.status === "fulfilled").length;
    const failed = results.length - sent;

    return {
      sent,
      failed,
      message: `Sent ${sent} reminder(s), ${failed} failed.`
    };
  }
);

const sendNewShowNotifications = inngest.createFunction(
  {id: "send-new-show-notifications"},
  { event: "app/show.added" },
  async ({ event })=>{
    const { movieTitle, movieId } = event.data;

    // Find subscribers for this movie
    const subs = await Notify.find({ movieId }).lean();
    if (subs.length === 0) return { message: "No subscribers for this movie." };

    const userIds = subs.map(s => s.userId);
    const users = await User.find({ _id: { $in: userIds } }).lean();

    for (const user of users) {
      const subject = `Tickets Open: ${movieTitle}`;
      const body = `<div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2>Hi ${user.name},</h2>
        <p>Tickets are now available for:</p>
        <h3 style="color: #F84565;">"${movieTitle}"</h3>
        <p><a href="${process.env.CLIENT_BASE_URL || ''}/movies/${movieId}" style="color:#F84565;">Book now</a></p>
        <br/>
        <p>Thanks,<br/>QuickShow Team</p>
      </div>`;
      await sendEmail({ to: user.email, subject, body });
    }

    return { message: `Notifications sent to ${users.length} subscriber(s).` }
}
)


export const functions = [
    syncUserCreation,
    syncUserDeletion,
    syncUserUpdation,
    releaseSeatsAndDeleteBooking,
    sendBookingConfirmationEmail,
    sendShowReminders,
    sendNewShowNotifications
];