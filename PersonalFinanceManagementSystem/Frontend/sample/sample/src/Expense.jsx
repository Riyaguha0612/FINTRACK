import axios from 'axios';
import React, { useState, useEffect, useContext } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import { UserContext } from './UserContext';
import './Expense.css';

Chart.register(...registerables);

const Expenses = () => {
  const [transaction, setTransaction] = useState([]);
  const [monthlyData, setMonthlyData] = useState({ labels: [], datasets: [] });
  const { username } = useContext(UserContext);

  const getCurrentAndPreviousMonth = () => {
    const currentDate = new Date();
    const currentMonth = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`;
    const previousMonthDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1);
    const previousMonth = `${previousMonthDate.getFullYear()}-${String(previousMonthDate.getMonth() + 1).padStart(2, '0')}`;

    return [previousMonth, currentMonth];
  };

  useEffect(() => {
    const fetchExpense = async () => {
      try {
        const response = await axios.get(`http://localhost:9000/home/transaction?username=${username}`);
        const transactions = response.data;
        setTransaction(transactions);

        console.log('Transactions:', transactions);

        const monthlyTotals = {};
        const [previousMonth, currentMonth] = getCurrentAndPreviousMonth();
        const relevantMonths = [previousMonth, currentMonth];

        relevantMonths.forEach((month) => {
          monthlyTotals[month] = { credit: 0, debit: 0 };
        });

        transactions.forEach((transaction) => {
          const date = new Date(transaction.date);
          const monthYear = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

          if (relevantMonths.includes(monthYear)) {
            if (transaction.creditOrDebit === 'credit') {
              monthlyTotals[monthYear].credit += parseFloat(transaction.amount);
            } else {
              monthlyTotals[monthYear].debit += parseFloat(Math.abs(transaction.amount));
            }
          }
        });

        console.log('Monthly Totals:', monthlyTotals);

        const labels = relevantMonths;
        const creditData = labels.map((label) => (monthlyTotals[label]?.credit || 0));
        const debitData = labels.map((label) => (monthlyTotals[label]?.debit || 0));

        console.log('Credit Data:', creditData);
        console.log('Debit Data:', debitData);

        setMonthlyData({
          labels: labels,
          datasets: [
            {
              label: 'Credit',
              data: creditData,
              backgroundColor: 'rgba(0, 100, 0, 0.6)', // Dark Green
            },
            {
              label: 'Debit',
              data: debitData,
              backgroundColor: 'rgba(139, 0, 0, 0.6)', // Dark Red
            },
          ],
        });
      } catch (error) {
        console.error('Error fetching expenses:', error);
      }
    };

    if (username) {
      fetchExpense();
    }
  }, [username]);

  const dataValues = monthlyData.datasets.flatMap((dataset) => dataset.data);
  const minValue = Math.min(0, ...dataValues);
  const maxValue = Math.max(...dataValues);
  const range = maxValue - minValue;
  const stepSize = Math.ceil(range / 10);

  return (
    <div className='expense-container'>
      <h1>Expense Breakdown</h1>
      <Bar
        data={monthlyData}
        options={{
          responsive: false,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true,
              min: minValue,
              max: maxValue,
              ticks: {
                stepSize: stepSize,
              },
            },
          },
        }}
        height={500}
        width={900}
      />
    </div>
  );
};

export default Expenses;
