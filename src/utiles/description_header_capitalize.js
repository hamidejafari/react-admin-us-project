const wordArr = [
  "a",
  "an",
  "the",
  "at",
  "but",
  "for",
  "by",
  "to",
  "etc.",
  "and",
  "as",
  "as if",
  "as long as",
  "at",
  "but",
  "by",
  "even if",
  "for",
  "from",
  "if",
  "if only",
  "in",
  "into",
  "like",
  "near",
  "now that",
  "nor",
  "of",
  "off",
  "on",
  "on top of",
  "once",
  "onto",
  "or",
  "out of",
  "over",
  "past",
  "so",
  "so that",
  "than",
  "that",
  "till",
  "to",
  "up",
  "upon",
  "with",
  "when",
  "yet",
];

const description_header_capitalize = (string) => {
  const strArr = string.split(" ");
  console.log(strArr);
  const newArr = [];
  strArr.forEach((word, index) => {
    if (index === 0) {
      const w = word.charAt(0).toUpperCase() + word.slice(1);
      newArr.push(w);
    } else if (wordArr.indexOf(word.toLowerCase()) < 0) {
      const w = word.charAt(0).toUpperCase() + word.slice(1);
      newArr.push(w);
    } else {
      newArr.push(word.toLowerCase());
    }
  });

  return newArr.join(" ");
};

export default description_header_capitalize;
