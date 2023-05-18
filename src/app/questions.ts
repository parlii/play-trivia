export interface Question {
  question: string;
  options: Option[];
  answer: string;
  confidence: Confidence;
}

export interface Confidence {
  //level can be high, medium, or low
  level: string;
  explanation: string;
}
export interface Option {
  option: string;
  explanation: string;
}

// const questions: Question[] = [
//   {
//     question: "What is the capital of Nepal?",
//     options: ["Kathmandu", "Pokhara", "Biratnagar", "Dharan"],
//     answer: "Kathmandu",
//   },
//   {
//     question: "Which is the highest peak in Nepal?",
//     options: ["K2", "Annapurna", "Makalu", "Mount Everest"],
//     answer: "Mount Everest",
//   },
//   {
//     question: "What is the national flower of Nepal?",
//     options: ["Rhododendron", "Lotus", "Marigold", "Sunflower"],
//     answer: "Rhododendron",
//   },
//   {
//     question: "What is the national bird of Nepal?",
//     options: ["Danphe", "Peacock", "Eagle", "Pigeon"],
//     answer: "Danphe",
//   },
//   {
//     question: "What is the currency of Nepal?",
//     options: ["Nepali Rupee", "Indian Rupee", "Nepali Dollar", "Nepali Yen"],
//     answer: "Nepali Rupee",
//   },
//   {
//     question: "Which of these rivers flow through Nepal?",
//     options: ["Ganges", "Brahmaputra", "Karnali", "Yamuna"],
//     answer: "Karnali",
//   },
//   {
//     question: "Which is the largest lake in Nepal?",
//     options: ["Rara Lake", "Phewa Lake", "Begnas Lake", "Tilicho Lake"],
//     answer: "Rara Lake",
//   },
//   {
//     question: "What is the main religion in Nepal?",
//     options: ["Hinduism", "Buddhism", "Islam", "Christianity"],
//     answer: "Hinduism",
//   },
//   {
//     question: "Which famous temple is located in Kathmandu?",
//     options: [
//       "Pashupatinath Temple",
//       "Swayambhunath",
//       "Boudhanath",
//       "Changu Narayan",
//     ],
//     answer: "Pashupatinath Temple",
//   },
//   {
//     question: "Which of the following is a popular Nepali dish?",
//     options: ["Samosa", "Dal Bhat", "Biryani", "Nasi Goreng"],
//     answer: "Dal Bhat",
//   },
//   {
//     question: "Which festival is known as the festival of lights in Nepal?",
//     options: ["Dashain", "Tihar", "Holi", "Maghe Sankranti"],
//     answer: "Tihar",
//   },
// ];

// export default questions;
