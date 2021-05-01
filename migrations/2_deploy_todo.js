var TodoList = artifacts.require("TodoList");
module.exports = function(_deployer) {
  // Use deployer to state migration tasks.
  _deployer.deploy(TodoList);
};
