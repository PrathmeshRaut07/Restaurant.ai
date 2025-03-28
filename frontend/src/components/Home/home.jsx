import React from 'react';

const Home = () => {
  // Hard-coded menu items for now
  const menuItems = [
    {
      id: 1,
      name: "Margherita Pizza",
      description: "Classic delight with fresh basil, tomato sauce, and mozzarella cheese.",
      price: 9.99,
    },
    {
      id: 2,
      name: "Pepperoni Pizza",
      description: "Loaded with pepperoni slices and extra cheese.",
      price: 11.99,
    },
    {
      id: 3,
      name: "Veggie Pizza",
      description: "A mix of bell peppers, olives, onions, and mushrooms.",
      price: 10.99,
    },
  ];

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Menu</h1>
      <ul>
        {menuItems.map((item) => (
          <li key={item.id} className="border p-3 mb-2 rounded">
            <h3 className="font-bold">{item.name}</h3>
            <p>{item.description}</p>
            <p>
              <strong>Price:</strong> ${item.price}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Home;
