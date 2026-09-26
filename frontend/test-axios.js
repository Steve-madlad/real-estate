// const axios = require('axios');
// const FormData = require('form-data');

// const apiClient = axios.create({
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });

// apiClient.interceptors.request.use(
//   async (config) => {
//     if (config.data instanceof FormData) {
//       config.headers?.delete('Content-Type');
//     }
//     return config;
//   }
// );

// const fd = new FormData();
// fd.append('test', '123');

// console.log('Sending request...');
// apiClient.post('https://httpbin.org/post', fd)
//   .then(res => {
//     console.log('Result headers received by httpbin:', res.data.headers);
//     console.log('Form data received by httpbin:', res.data.form);
//   })
//   .catch(err => console.error(err.message));
