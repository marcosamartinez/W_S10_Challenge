import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchOrderHistory, setSelectedSize } from "../state/ordersSlice";

export default function OrderList() {
  const dispatch = useDispatch();
  const { history, status, error, selectedSize } = useSelector(
    (state) => state.orders
  );

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchOrderHistory());
    }
  }, []);

  const filteredOrders =
    selectedSize === "All"
      ? history
      : history.filter((order) => order.size === selectedSize);

  if (status === "loading") {
    return (
      <div id="orderList">
        <h2>Pizza Orders</h2>
        <div>Loading orders...</div>
      </div>
    );
  }

  return (
    <div id="orderList">
      <h2>Pizza Orders</h2>
      {status === "failed" && <div>Error: {error}</div>}
      <ol>
        {filteredOrders.map((order) => {
          console.log("order", order);
          return (
            <li key={`order-${order.id}`}>
              <div>
                {order.customer} orderd a size {order.size} with{" "}
                {order.toppings && order.toppings.length} toppings
              </div>
            </li>
          );
        })}
      </ol>
      <div id="sizeFilters">
        Filter by size:
        {["All", "S", "M", "L"].map((size) => {
          const className = `button-filter${
            size === selectedSize ? " active" : ""
          }`;
          console.log(`filterBtn${size}`);
          return (
            <button
              data-testid={`filterBtn${size}`}
              className={className}
              onClick={() => dispatch(setSelectedSize(size))}
              key={size}
            >
              {size}
            </button>
          );
        })}
      </div>
    </div>
  );
}
