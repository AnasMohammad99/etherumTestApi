pragma solidity >=0.4.25 <0.6.0;

contract BookStore {
    address sender;
    string fullname;
    string discription;
    uint256 price;

    function sellBook(
        string memory _fullname,
        string memory _discription,
        uint256 _price
    ) public {
        sender = msg.sender;
        fullname = _fullname;
        discription = _discription;
        price = _price;
    }

    function getBook()
        public
        view
        returns (
            address _sender,
            string memory _fullname,
            string memory _discription,
            uint256 _price
        )
    {
        return (sender, fullname, discription, price);
    }
}
