export interface Question {
  text: string;
  options: string[];
  correctOption: string;
}

const questions: Question[] = [
  {
    text: "What is the capital of Nepal?",
    options: ["Kathmandu", "Pokhara", "Biratnagar", "Dharan"],
    correctOption: "Kathmandu",
  },
  {
    text: "Which is the highest peak in Nepal?",
    options: ["K2", "Annapurna", "Makalu", "Mount Everest"],
    correctOption: "Mount Everest",
  },
  {
    text: "What is the national flower of Nepal?",
    options: ["Rhododendron", "Lotus", "Marigold", "Sunflower"],
    correctOption: "Rhododendron",
  },
  {
    text: "What is the national bird of Nepal?",
    options: ["Danphe", "Peacock", "Eagle", "Pigeon"],
    correctOption: "Danphe",
  },
  {
    text: "What is the currency of Nepal?",
    options: ["Nepali Rupee", "Indian Rupee", "Nepali Dollar", "Nepali Yen"],
    correctOption: "Nepali Rupee",
  },
  {
    text: "Which of these rivers flow through Nepal?",
    options: ["Ganges", "Brahmaputra", "Karnali", "Yamuna"],
    correctOption: "Karnali",
  },
  {
    text: "Which is the largest lake in Nepal?",
    options: ["Rara Lake", "Phewa Lake", "Begnas Lake", "Tilicho Lake"],
    correctOption: "Rara Lake",
  },
  {
    text: "What is the main religion in Nepal?",
    options: ["Hinduism", "Buddhism", "Islam", "Christianity"],
    correctOption: "Hinduism",
  },
  {
    text: "Which famous temple is located in Kathmandu?",
    options: [
      "Pashupatinath Temple",
      "Swayambhunath",
      "Boudhanath",
      "Changu Narayan",
    ],
    correctOption: "Pashupatinath Temple",
  },
  {
    text: "Which of the following is a popular Nepali dish?",
    options: ["Samosa", "Dal Bhat", "Biryani", "Nasi Goreng"],
    correctOption: "Dal Bhat",
  },
  {
    text: "Which festival is known as the festival of lights in Nepal?",
    options: ["Dashain", "Tihar", "Holi", "Maghe Sankranti"],
    correctOption: "Tihar",
  },
];

export default questions;
