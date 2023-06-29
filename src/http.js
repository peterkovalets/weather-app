export default function getJSON(url) {
  return new Promise((resolve, reject) => {
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        if (data.cod !== 200) {
          reject(data.message);
        } else {
          resolve(data);
        }
      });
  });
}
