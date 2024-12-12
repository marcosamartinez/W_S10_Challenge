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

  return (
    <div id="orderList">
      <h2>Pizza Orders</h2>
      {status === "loading" && <div>Loading orders...</div>}
      {status === "failed" && <div>Error: {error}</div>}
      {status !== "loading" && (
        <ol>
          {filteredOrders.map((order) => (
            <li key={`order-${order.id}`}>
              <div>
                {order.customer} ordered a size {order.size} with{" "}
                {order.toppings ? order.toppings.length : "no"} toppings
              </div>
            </li>
          ))}
        </ol>
      )}
      <div id="sizeFilters">
        Filter by size:
        <button
          data-testid="filterBtnAll"
          className={`button-filter${selectedSize === "All" ? " active" : ""}`}
          onClick={() => dispatch(setSelectedSize("All"))}
        >
          All
        </button>
        <button
          data-testid="filterBtnS"
          className={`button-filter${selectedSize === "S" ? " active" : ""}`}
          onClick={() => dispatch(setSelectedSize("S"))}
        >
          S
        </button>
        <button
          data-testid="filterBtnM"
          className={`button-filter${selectedSize === "M" ? " active" : ""}`}
          onClick={() => dispatch(setSelectedSize("M"))}
        >
          M
        </button>
        <button
          data-testid="filterBtnL"
          className={`button-filter${selectedSize === "L" ? " active" : ""}`}
          onClick={() => dispatch(setSelectedSize("L"))}
        >
          L
        </button>
      </div>
    </div>
  );
}
