import { useState } from "react";
const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];

function App() {
  const [friends, setFriends] = useState([...initialFriends]);
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [selectedFriend, setSelectedFriend] = useState(null);
  function addHandler() {
    setShowAddFriend((show) => !show);
  }
  // function addFriend(friend) {
  //   setFriends((friends) => [...friends, friend]);
  // }
  function addFriend(friend) {
    setFriends((friends) => [...friends, friend]);
    setShowAddFriend(false);
  }
  function handleSelection(friend) {
    // setSelectedFriend(friend);
    setSelectedFriend((cur) => (cur?.id === friend.id ? null : friend));
    setShowAddFriend(false);
  }
  function handleSplitBill(value) {
    setFriends((friends) =>
      friends.map((friend) =>
        friend.id === selectedFriend.id
          ? { ...friend, balance: friend.balance + value }
          : friend
      )
    );
  }

  return (
    <div className="app">
      <div className="side-bar">
        <FriendList
          friends={friends}
          onSeclection={handleSelection}
          selectedFriend={selectedFriend}
        />

        {showAddFriend && <Formaddfriend onAddFriend={addFriend} />}
        <button className="button" onClick={addHandler}>
          {showAddFriend ? "Close" : "Add Friend"}
        </button>
      </div>
      {selectedFriend && (
        <Formsplitbill
          selectedFriend={selectedFriend}
          onSplitBill={handleSplitBill}
        />
      )}
    </div>
  );
}
export default App;

function FriendList({ friends, onSeclection, selectedFriend }) {
  return (
    <ul>
      {friends.map((friend) => (
        <Friend
          friend={friend}
          key={friend.id}
          onSeclection={onSeclection}
          selectedFriend={selectedFriend}
        />
      ))}
    </ul>
  );
}

function Friend({ friend, onSeclection, selectedFriend }) {
  const isSelected = selectedFriend?.id === friend.id;
  return (
    <li className={isSelected ? "selected" : ""}>
      <img src={friend.image} alt={friend.name} />
      <h2>{friend.name}</h2>
      {friend.balance < 0 && (
        <p className="red">
          You owe {friend.name} {Math.abs(friend.balance)}$
        </p>
      )}
      {friend.balance > 0 && (
        <p className="green">
          {friend.name} owe You {Math.abs(friend.balance)}$
        </p>
      )}
      {friend.balance === 0 && <p>You & {friend.name} are even</p>}
      <button className="button" onClick={() => onSeclection(friend)}>
        {isSelected ? "Close" : "Selected"}
      </button>
    </li>
  );
}

function Formaddfriend({ onAddFriend }) {
  const [name, setName] = useState("");
  const [image, setImage] = useState("https://i.pravatar.cc/48");
  const id = crypto.randomUUID();
  function handleSubmit(e) {
    if (!name || !image) return;
    e.preventDefault();
    const newFriend = { name, image: `${image}?=${id}`, balance: 0, id };
    console.log(newFriend);
    setImage("https://i.pravatar.cc/48");
    setName("");
    onAddFriend(newFriend);
  }
  return (
    <form className="form-add-friend" onSubmit={handleSubmit}>
      <label>🧑‍🤝‍👩Add Friend Name</label>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <label>🖼️ Image URL</label>
      <input
        type="text"
        value={image}
        onChange={(e) => setImage(e.target.value)}
      />
      <button className="button">ADD</button>
    </form>
  );
}

function Formsplitbill({ selectedFriend, onSplitBill }) {
  const [bil, setBill] = useState("");
  const [paidByUser, setPaidByUser] = useState("");
  const billPaidByFriend = bil ? bil - paidByUser : "";
  const [whoPaidBill, setWhopaiduser] = useState("user");
  function handleSubmit(e) {
    e.preventDefault();
    if (!bil || !paidByUser) return;
    onSplitBill(whoPaidBill === "user" ? billPaidByFriend : -paidByUser);
  }
  return (
    <form className="friend-split-bill" onSubmit={handleSubmit}>
      <h2>Split bill with {selectedFriend.name}</h2>
      <label>Bill value</label>
      <input
        type="text"
        value={bil}
        onChange={(e) => setBill(Number(e.target.value))}
      />
      <label>You Expense</label>
      <input
        type="text"
        value={paidByUser}
        onChange={(e) =>
          setPaidByUser(
            Number(e.target.value) > bil ? paidByUser : Number(e.target.value)
          )
        }
      />
      <label> {selectedFriend.name}' Expense </label>
      <input type="text" disabled value={billPaidByFriend} />
      <label>Who is paying the bill </label>
      <select
        value={whoPaidBill}
        onChange={(e) => setWhopaiduser(e.target.user)}
      >
        <option value="user">You</option>
        <option value="friend"> {selectedFriend.name}</option>
      </select>
    </form>
  );
}
