import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchOrderHistory, submitOrder } from "../state/ordersSlice";

const TOPPINGS = {
  1: "Pepperoni",
  2: "Greenpeppers",
  3: "Pineapple",
  4: "Mushrooms",
  5: "Ham",
};

export default function PizzaForm() {
  const dispatch = useDispatch();
  const { submitStatus, submitError } = useSelector((state) => state.orders);

  const [formData, setFormData] = useState({
    fullName: "",
    size: "",
    1: false,
    2: false,
    3: false,
    4: false,
    5: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const selectedToppings = Object.entries(TOPPINGS)
      .filter(([key]) => formData[key])
      .map(([label]) => label);

    const orderData = {
      fullName: formData.fullName,
      size: formData.size,
      toppings: selectedToppings,
    };

    try {
      const result = await dispatch(submitOrder(orderData));
      console.log("result", result);

      if (submitOrder.fulfilled.match(result)) {
        // Clear form on successful submission
        setFormData({
          fullName: "",
          size: "",
          1: false,
          2: false,
          3: false,
          4: false,
          5: false,
        });

        // Fetch updated order history
        dispatch(fetchOrderHistory());
      }
    } catch (error) {
      console.error("Error submitting order:", error);
    }
  };

  const getErrorMessage = () => {
    if (submitError) {
      return `Order failed: ${submitError}`;
    }
    return "Order failed: Please check your inputs";
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Pizza Form</h2>
      <div>
        {submitStatus === "pending" && (
          <div className="pending">Order in progress...</div>
        )}
        {submitStatus === "failed" && (
          <div className="failure">{getErrorMessage()} </div>
        )}
      </div>
      <div className="input-group">
        <div>
          <label htmlFor="fullName">Full Name</label>
          <br />
          <input
            data-testid="fullNameInput"
            id="fullName"
            name="fullName"
            placeholder="Type full name"
            type="text"
            value={formData.fullName}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="input-group">
        <div>
          <label htmlFor="size">Size</label>
          <br />
          <select
            data-testid="sizeSelect"
            id="size"
            name="size"
            value={formData.size}
            onChange={handleChange}
          >
            <option value="ALL">----Choose size----</option>
            <option value="S">Small</option>
            <option value="M">Medium</option>
            <option value="L">Large</option>
          </select>
        </div>
      </div>

      <div className="input-group">
        {Object.entries(TOPPINGS).map(([key, label]) => (
          <label key={key}>
            <input
              data-testid={`check${label.replace(/\s+/g, "")}`}
              name={key}
              type="checkbox"
              checked={formData[key]}
              onChange={handleChange}
            />
            {label}
            <br />
          </label>
        ))}
      </div>
      <input data-testid="submit" type="submit" />
    </form>
  );
}
