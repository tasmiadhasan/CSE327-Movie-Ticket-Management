import React, { useCallback, useEffect, useState } from 'react'
import Loading from '../../components/Loading';
import Title from '../../components/admin/Title';
import { dateFormat } from '../../lib/dateFormat';
import { useAppContext } from '../../context/AppContext';

const ListBookings = () => {
  const {axios, getToken, user}= useAppContext()
  const currency = import.meta.env.VITE_CURRENCY

  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const getAllBookings = useCallback(async () => {
    try {
      setError("");
      const { data } = await axios.get("/api/admin/all-bookings", {
        headers: { Authorization: `Bearer ${await getToken()}` }
      });
      if (data?.success) {
        setBookings(Array.isArray(data.bookings) ? data.bookings : []);
      } else {
        setError(data?.message || "Failed to load bookings");
      }
    } catch (err) {
      console.error(err);
      setError(
        err?.response?.data?.message ||
          (err?.response?.status === 401 || err?.response?.status === 403
            ? "Not authorized to view bookings"
            : "Something went wrong while loading bookings")
      );
    } finally {
      setIsLoading(false);
    }
  }, [axios, getToken]);

  useEffect(() => {
    if(user){
      getAllBookings();
    }
  }, [user, getAllBookings]);

  
  return !isLoading ? (
  <>
    <Title text1="List" text2="Bookings" />
    <div className="max-w-4xl mt-6 overflow-x-auto">
      {error && (
        <div className="text-red-400 bg-red-500/10 border border-red-500/30 rounded p-3 mb-4">
          {error}
        </div>
      )}
      {bookings.length === 0 && !error ? (
        <div className="text-gray-300 bg-primary/5 border border-primary/20 rounded p-3">
          No bookings found.
        </div>
      ) : (
        <table className="w-full border-collapse rounded-md overflow-hidden text-nowrap">
          <thead>
            <tr className="bg-primary/20 text-left text-white">
              <th className="p-2 font-medium pl-5">User Name</th>
              <th className="p-2 font-medium">Movie Name</th>
              <th className="p-2 font-medium">Show Time</th>
              <th className="p-2 font-medium">Seats</th>
              <th className="p-2 font-medium">Amount</th>
            </tr>
          </thead>
          <tbody className="text-sm font-light">
            {bookings.map((item, index) => (
              <tr
                key={index}
                className="border-b border-primary/20 bg-primary/5 even:bg-primary/10"
              >
                <td className="p-2 min-w-45 pl-5">{item?.user?.name || "Unknown"}</td>
                <td className="p-2">{item?.show?.movie?.title || "Unknown"}</td>
                <td className="p-2">
                  {item?.show?.showDateTime ? dateFormat(item.show.showDateTime) : "-"}
                </td>
                <td className="p-2">
                  {Array.isArray(item?.bookedSeats)
                    ? item.bookedSeats.join(", ")
                    : ""}
                </td>
                <td className="p-2">
                  {currency} {typeof item?.amount === "number" ? item.amount : 0}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  </>
) : <Loading />
}

export default ListBookings;
