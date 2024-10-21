import React, { useState } from 'react';
import './MortgageCalculator.css';

const MortgageCalculator = () => {
  const [amount, setAmount] = useState('');
  const [term, setTerm] = useState('');
  const [rate, setRate] = useState('');
  const [type, setType] = useState('repayment');
  const [monthlyPayment, setMonthlyPayment] = useState(null);
  const [totalPayment, setTotalPayment] = useState(null);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!amount) newErrors.amount = 'Mortgage amount is required';
    if (!term) newErrors.term = 'Mortgage term is required';
    if (!rate) newErrors.rate = 'Interest rate is required';
    return newErrors;
  };

  const calculateRepayment = (e) => {
    e.preventDefault();
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }
    setErrors({});

    const principal = parseFloat(amount);
    const annualRate = parseFloat(rate) / 100;
    const months = parseInt(term) * 12;

    let monthly = 0;
    if (type === 'repayment') {
      const monthlyRate = annualRate / 12;
      monthly = principal * (monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);
    } else if (type === 'interestOnly') {
      monthly = (principal * (annualRate / 12));
    }

    setMonthlyPayment(monthly.toFixed(2));
    setTotalPayment((monthly * months).toFixed(2));
  };

  const handleInputChange = (setter) => (e) => {
    setter(e.target.value);
  };

  return (
    <div className="mortgage-calculator">
      <form onSubmit={calculateRepayment}>
        <div className="input-group">
          <label>Mortgage Amount</label>
          <input
            type="number"
            value={amount}
            onChange={handleInputChange(setAmount)}
            placeholder="e.g. 300000"
            aria-label="Mortgage amount"
          />
          {errors.amount && <span className="error-message">{errors.amount}</span>}
        </div>

        <div className="input-group">
          <label>Mortgage Term (years)</label>
          <input
            type="number"
            value={term}
            onChange={handleInputChange(setTerm)}
            placeholder="e.g. 25"
            aria-label="Mortgage term in years"
          />
          {errors.term && <span className="error-message">{errors.term}</span>}
        </div>

        <div className="input-group">
          <label>Interest Rate (%)</label>
          <input
            type="number"
            step="0.01"
            value={rate}
            onChange={handleInputChange(setRate)}
            placeholder="e.g. 5.25"
            aria-label="Interest rate percentage"
          />
          {errors.rate && <span className="error-message">{errors.rate}</span>}
        </div>

        <div className="input-group mortgage-type">
          <label>Mortgage Type</label>
          <div>
            <input
              type="radio"
              name="mortgageType"
              value="repayment"
              checked={type === 'repayment'}
              onChange={() => setType('repayment')}
              aria-label="Repayment mortgage"
            />
            <label>Repayment</label>

            <input
              type="radio"
              name="mortgageType"
              value="interestOnly"
              checked={type === 'interestOnly'}
              onChange={() => setType('interestOnly')}
              aria-label="Interest-only mortgage"
            />
            <label>Interest Only</label>
          </div>
        </div>

        <button type="submit">Calculate Repayments</button>
      </form>

      {monthlyPayment && totalPayment && (
        <div className="results">
          <h3>Your Results</h3>
          <p>Monthly Repayment: £{monthlyPayment}</p>
          <p>Total Payment: £{totalPayment}</p>
        </div>
      )}
    </div>
  );
};

export default MortgageCalculator;
