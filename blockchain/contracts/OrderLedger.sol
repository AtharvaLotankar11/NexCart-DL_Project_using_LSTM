// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract OrderLedger {
    address public owner;

    enum OrderStatus { Pending, Shipped, Arrived }

    struct Order {
        string orderId;
        OrderStatus status;
        uint256 timestamp;
    }

    // Mapping from orderId strings to their respective Order structs
    mapping(string => Order) public orders;

    // Mapping to track if an order actually exists
    mapping(string => bool) public orderExists;

    event OrderCreated(string indexed orderId, OrderStatus status, uint256 timestamp);
    event OrderStatusUpdated(string indexed orderId, OrderStatus status, uint256 timestamp);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can perform this action");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    // Function to create a new order ledger entry (callable by anyone - the buyer signs their own order)
    function createOrder(string memory _orderId) public {
        require(!orderExists[_orderId], "Order already exists");
        
        orders[_orderId] = Order({
            orderId: _orderId,
            status: OrderStatus.Pending,
            timestamp: block.timestamp
        });
        
        orderExists[_orderId] = true;

        emit OrderCreated(_orderId, OrderStatus.Pending, block.timestamp);
    }

    // Function to update the order status
    function updateOrderStatus(string memory _orderId, OrderStatus _status) public onlyOwner {
        require(orderExists[_orderId], "Order does not exist");
        
        orders[_orderId].status = _status;
        orders[_orderId].timestamp = block.timestamp;

        emit OrderStatusUpdated(_orderId, _status, block.timestamp);
    }

    // Function to get order details
    function getOrder(string memory _orderId) public view returns (string memory, OrderStatus, uint256) {
        require(orderExists[_orderId], "Order does not exist");
        Order memory o = orders[_orderId];
        return (o.orderId, o.status, o.timestamp);
    }
}
