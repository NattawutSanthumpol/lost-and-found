'use client';

import { LostStatus } from '@prisma/client';
import { useRouter } from 'next/navigation';

const StatusFilterDropdown = () => {
    const router = useRouter();

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        e.preventDefault();

        const value = e.target.value; //(e.currentTarget[0] as HTMLInputElement).value;

        const params = new URLSearchParams(window.location.search);
        params.set("status", value);
        router.push(`${window.location.pathname}?${params}`);
    };

    return (
        <select
            className="border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
            onChange={handleChange}
        >
            <option value="">All Status</option>
            {Object.values(LostStatus).map((val) => (
                <option key={val} value={val}>
                    {val.charAt(0) + val.substring(1).toLocaleLowerCase()}
                </option>
            ))}
        </select>
    );
};

export default StatusFilterDropdown;
