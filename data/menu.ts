const sliderImg1 = require("../assets/images/Home/1.webp");
const exploreImg1 = require("../assets/images/Home/2.webp");
const exploreImg2 = require("../assets/images/Home/3.webp");
const exploreImg3 = require("../assets/images/Home/4.webp");
const exploreImg4 = require("../assets/images/Home/5.webp");
const exploreImg5 = require("../assets/images/Home/6.webp");
const exploreImg6 = require("../assets/images/Home/7.webp");
const sliderImg2 = require("../assets/images/Home/12.webp");
const sliderImg3 = require("../assets/images/Home/13.webp");
const sliderImg4 = require("../assets/images/Home/11.webp");


export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: any;
  isFavorite: boolean;
  fullDescription: string;
  drinkOptions?: string[];
}

export interface MenuCategory {
  category: string;
  items: MenuItem[];
}

export const menuDataSource: MenuCategory[] = [
  {
    category: "Zalmi Meal",
    items: [
      {
        id: "zalmi1",
        name: "Zalmi Meal Deal",
        description: "1 Regular Crown Crust Pizza\n1 Fettuccine Alfredo Pasta...",
        price: 2500,
        image: sliderImg1,
        isFavorite: false,
        fullDescription: "1 Regular Crown Crust Pizza\n1 Fettuccine Alfredo Pasta\n1 Liter Cold Drink",
        drinkOptions: ["Cola Next", "Rango Next"],
      },
      {
        id: "zalmi2",
        name: "Solo Zalmi Feast",
        description: "1 Personal Pan Pizza, 2pc Chicken Wings, 1 Drink.",
        price: 1200,
        image: sliderImg2,
        isFavorite: false,
        fullDescription: "Perfect for one! 1 Personal Pan Pizza (any flavor), 2 pieces of succulent Chicken Wings, and 1 Regular Cold Drink.",
      },
    ],
  },
  {
    category: "Turn up the heat",
    items: [
      {
        id: "heat1",
        name: "Peri Peri Pizza",
        description: "A bold, tangy, and spicy delight infused with our special Cheezi...",
        price: 1600,
        image: exploreImg1,
        isFavorite: false,
        fullDescription: "A bold, tangy, and spicy delight infused with our special Cheezi Cheezious Peri Peri Sauce.",
      },
      {
        id: "heat2",
        name: "Spicy Ranch Pizza",
        description: "Creamy ranch with a kick of spice and loaded with chicken.",
        price: 1750,
        image: exploreImg4,
        isFavorite: true,
        fullDescription: "Our signature creamy ranch sauce, topped with spicy chicken chunks, jalapenos, onions, and a generous layer of mozzarella.",
      },
       {
        id: "heat3",
        name: "Volcano Blast Burger",
        description: "Crispy zinger patty drenched in fiery volcano sauce.",
        price: 850,
        image: sliderImg3,
        isFavorite: false,
        fullDescription: "Dare to try? A perfectly crispy zinger patty, fresh lettuce, and our hottest volcano sauce, all in a soft bun.",
      },
    ],
  },
  {
    category: "Starters",
    items: [
      {
        id: "starter1",
        name: "Cheezy Sticks",
        description: "Freshly baked bread filled with the yummiest Cheese blend to ...",
        price: 630,
        image: exploreImg2,
        isFavorite: false,
        fullDescription: "Freshly baked bread filled with the yummiest Cheese blend to satisfy your cravings.",
      },
      {
        id: "starter2",
        name: "Oven Baked Wings",
        description: "Fresh Oven baked wings served with Dip Sauce.",
        price: 600,
        image: exploreImg3,
        isFavorite: false,
        fullDescription: "Fresh Oven baked wings served with Dip Sauce. Choice of Hot or BBQ.",
      },
      {
        id: "starter3",
        name: "Garlic Bread Supreme",
        description: "Toasted garlic bread topped with cheese and herbs.",
        price: 450,
        image: exploreImg5,
        isFavorite: true,
        fullDescription: "Classic garlic bread, toasted to perfection and topped with a melted mozzarella cheese blend and a sprinkle of herbs.",
      },
      {
        id: "starter4",
        name: "Loaded Fries",
        description: "Crispy fries topped with cheese sauce, chicken, and jalapenos.",
        price: 700,
        image: exploreImg6,
        isFavorite: false,
        fullDescription: "A generous portion of our signature crispy fries, loaded with creamy cheese sauce, seasoned chicken bits, and spicy jalapenos.",
      },
    ],
  },
  {
    category: "Something Sweet",
    items: [
      {
        id: "sweet1",
        name: "Molten Lava Cake",
        description: "Warm chocolate cake with a gooey molten center.",
        price: 550,
        image: sliderImg4,
        isFavorite: false,
        fullDescription: "A decadent chocolate lover's dream. Warm, rich chocolate cake with a gooey, molten chocolate center, served with a dusting of powdered sugar.",
      },
      {
        id: "sweet2",
        name: "New York Cheesecake",
        description: "Classic creamy cheesecake with a graham cracker crust.",
        price: 650,
        image: exploreImg1,
        isFavorite: true,
        fullDescription: "Authentic New York style cheesecake, rich and creamy, with a traditional graham cracker crust. Served chilled.",
      }
    ],
  },
   {
    category: "Beverages",
    items: [
      {
        id: "bev1",
        name: "Classic Mojito",
        description: "Refreshing mint and lime cooler.",
        price: 350,
        image: exploreImg2,
        isFavorite: false,
        fullDescription: "A classic non-alcoholic mojito with fresh mint leaves, lime juice, sugar, and soda water. Super refreshing!",
      },
      {
        id: "bev2",
        name: "Oreo Shake",
        description: "Creamy milkshake blended with Oreo cookies.",
        price: 480,
        image: exploreImg3,
        isFavorite: false,
        fullDescription: "Indulgent and creamy milkshake made with vanilla ice cream, milk, and plenty of Oreo cookies, topped with whipped cream.",
      }
    ],
  },
];