import { useEffect, useState } from "react";
import axios from "axios";

const useAdAccounts = (accessToken) => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAccounts = async () => {
      if (!accessToken) return;
      setLoading(true);
      setError("");
      try {
        const res = await axios.get("https://graph.facebook.com/v19.0/me/adaccounts", {
          params: {
            access_token: accessToken,
            fields: "id,name,account_status",
          },
        });
        setAccounts(res.data.data);
      } catch (err) {
        setError("Gagal mengambil ad accounts: " + err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchAccounts();
  }, [accessToken]);

  return { accounts, loading, error };
};

export default useAdAccounts;
