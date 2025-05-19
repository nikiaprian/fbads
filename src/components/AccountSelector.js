// components/AccountSelector.js
import React from "react";

const AccountSelector = ({ accounts, selectedAccount, onChange }) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-gray-700 mb-1">
      Pilih Ad Account
    </label>
    <select
      value={selectedAccount}
      onChange={(e) => onChange(e.target.value)}
      className="p-2 border rounded w-full"
    >
      {accounts.map((acc) => (
        <option key={acc.id} value={acc.id}>
          {acc.name} ({acc.id})
        </option>
      ))}
    </select>
  </div>
);

export default AccountSelector;
