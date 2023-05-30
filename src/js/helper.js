import { TIME_OUT_SEC } from './config.js';

const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

export async function AJAX(url, uploadData = undefined) {
  try {
    const fetchPro = uploadData
      ? fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'Application/json',
          },
          body: JSON.stringify(uploadData),
        })
      : fetch(url);

    const res = await Promise.race([fetchPro, timeout(TIME_OUT_SEC)]);

    const data = await res.json();
    if (!res.ok) {
      throw new Error(`${data.message} ${res.status}`);
    }

    if (data.data.recipe) {
      const { recipe } = data.data;
      return recipe;
    }

    if (data.data.recipes) {
      const { recipes } = data.data;
      return recipes;
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
}

// export const getJSON = async function (url) {
//   try {

//     const res = await Promise.race([fetchPro, timeout(TIME_OUT_SEC)]);

//     const data = await res.json();

//     if (!res.ok) {
//       throw new Error(`${data.message} ${res.status}`);
//     }

//     if (data.data.recipe) {
//       const { recipe } = data.data;
//       return recipe;
//     }

//     if (data.data.recipes) {
//       const { recipes } = data.data;
//       return recipes;
//     }
//   } catch (error) {
//     throw error;
//   }
// };

// export const sendJSON = async function (url, newData) {
//   try {
//     const fetchPro = fetch(url, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'Application/json',
//       },
//       body: JSON.stringify(newData),
//     });

//     const res = await Promise.race([fetchPro, timeout(TIME_OUT_SEC)]);

//     const data = await res.json();

//     if (!res.ok) {
//       throw new Error(`${data.message} ${res.status}`);
//     }

//     return data;
//   } catch (error) {
//     throw error;
//   }
// };
