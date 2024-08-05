// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract IoTDeviceSecurity {
    address public owner;

    struct Device {
        string deviceId;
        address deviceAddress;
        bool isAuthorized;
        uint256 lastHeartbeat;
    }

    mapping(string => Device) public devices;

    event DeviceRegistered(string deviceId, address deviceAddress);
    event DeviceAuthorized(string deviceId, bool isAuthorized);
    event HeartbeatReceived(string deviceId, uint256 timestamp);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can perform this action");
        _;
    }

    modifier onlyAuthorizedDevice(string memory deviceId) {
        require(devices[deviceId].deviceAddress == msg.sender, "Only authorized device can perform this action");
        require(devices[deviceId].isAuthorized == true, "Device is not authorized");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function registerDevice(string memory deviceId, address deviceAddress) public onlyOwner {
        devices[deviceId] = Device({
            deviceId: deviceId,
            deviceAddress: deviceAddress,
            isAuthorized: false,
            lastHeartbeat: block.timestamp
        });

        emit DeviceRegistered(deviceId, deviceAddress);
    }

    function authorizeDevice(string memory deviceId, bool isAuthorized) public onlyOwner {
        devices[deviceId].isAuthorized = isAuthorized;
        emit DeviceAuthorized(deviceId, isAuthorized);
    }

    function sendHeartbeat(string memory deviceId) public onlyAuthorizedDevice(deviceId) {
        devices[deviceId].lastHeartbeat = block.timestamp;
        emit HeartbeatReceived(deviceId, block.timestamp);
    }

    function checkDeviceAuthorization(string memory deviceId) public view returns (bool) {
        return devices[deviceId].isAuthorized;
    }

    function getLastHeartbeat(string memory deviceId) public view returns (uint256) {
        return devices[deviceId].lastHeartbeat;
    }
}