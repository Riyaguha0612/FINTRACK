import React, { useContext, useState, useEffect } from 'react';
import './Bill.css';
import { UserContext } from './UserContext';
import axios from 'axios';
import './Goals.css';

const Goals = () => {
  const { username } = useContext(UserContext);
  const [isFormVisible, setFormVisible] = useState(false);
  const [goals, setGoals] = useState([]);
  const [successMsg, setSuccessMsg] = useState('');
  const [error, setError] = useState('');
  const [transactions, setTransactions] = useState([]);
  const [goalsDetails, setGoalsDetails] = useState({
    goalName: '',
    goalAmount: '',
  });

  const toggleOverlay = () => {
    setFormVisible(!isFormVisible);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setGoalsDetails({ ...goalsDetails, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await axios.post('http://localhost:9000/home/goals/add', {
      ...goalsDetails,
      username: username,
    });
    if (response.status === 200) {
      setSuccessMsg('Goal added successfully');
      const response2 = await axios.get(
        `http://localhost:9000/home/transaction?username=${username}`
      );
      if (response2.status === 200) {
        setTransactions(response2.data);
        toggleOverlay();
        const response = await axios.get(
          `http://localhost:9000/home/goals?username=${username}`
        );
        if (response.status === 200) {
          setGoals(response.data);
        }
      }

    } else {
      setError('Failed to add goal');
    }
  };

  useEffect(() => {
  const fetchGoalsWithProgress = async () => {
    const response = await axios.get(`http://localhost:9000/home/goals?username=${username}`);
    if (response.status === 200) {
      setGoals(response.data);
    }
  };

  if (username) {
    fetchGoalsWithProgress();
  }
}, [username]);


  const calculateSpentAmount = (goalName) => {
    return transactions
      .filter((transaction) => transaction.goal === goalName)
      .reduce((total, transaction) => {
        if (transaction.creditOrDebit === 'debit') {
          return total - parseFloat(transaction.amount);
        }
        return total;
      }, 0);
  };

  return (
    <React.Fragment>
      <div className="bill-container">
        <h1>Your Goals</h1>
        {isFormVisible && (
          <div className="overlay">
            <div className="overlay-content">
              <div>
                <h1>Add new Goals</h1>
                <button onClick={toggleOverlay}>X</button>
              </div>
              <form onSubmit={handleSubmit}>
                <label htmlFor="goalName">Enter Goal name:</label>
                <input
                  type="text"
                  value={goalsDetails.goalName}
                  name="goalName"
                  onChange={handleInputChange}
                  placeholder="Goal Name"
                  required
                />
                <label htmlFor="goalAmount">Enter Goal Amount:</label>
                <input
                  type="number"
                  name="goalAmount"
                  value={goalsDetails.goalAmount}
                  onChange={handleInputChange}
                  placeholder="Goal Amount"
                  required
                />
                <button type="submit">Add Goal</button>
              </form>
            </div>
          </div>
        )}

        <div className="goals-container">
          {goals.length > 0 ? (
            goals.map((goal, index) => {
              const spentAmount = calculateSpentAmount(goal.goalName);
              const remainingAmount = parseFloat(goal.goalAmount) - spentAmount;
              const spentPercentage = Math.min((spentAmount / goal.goalAmount) * 100, 100); // Ensure it does not exceed 100%

              // Determine if the progress bar should be red
              const progressBarColor = spentPercentage >= 80 ? 'red' : '#007bff';

              return (
                <div className="goal-card " key={index}>
                  <div className="goal-header">
                    <div className="goal-shape"></div>
                    <h2>{goal.goalName}</h2>
                  </div>
                  <p><strong>Goal Amount:</strong> ${goal.goalAmount}</p>
                  <p><strong>Amount Spent:</strong> ${spentAmount}</p>
                  <p><strong>Remaining Amount:</strong> ${remainingAmount}</p>
                  {remainingAmount < 0 && (
                    <p className="overspending">Overspending!</p>
                  )}
                  {remainingAmount >= 0 && spentPercentage > 80 && remainingAmount > 0 && (
                    <p className="spend-warning">Spend accordingly!</p>
                  )}
                  <div className="goal-progress">
                    <div className="progress-bar" style={{ width: `${spentPercentage.toFixed(2)}%`, backgroundColor: progressBarColor }}></div>
                  </div>
                </div>
              );
            })
          ) : (
            <p>No goals added</p>
          )}
        </div>

        <button id="add-btn" onClick={toggleOverlay}>
          Add Goal
        </button>

        {error && <p className="error">{error}</p>}
        {successMsg && <p className="success">{successMsg}</p>}
      </div>
    </React.Fragment>
  );
};

export default Goals;