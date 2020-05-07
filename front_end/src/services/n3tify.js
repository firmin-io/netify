require("dotenv").config();
// replace this value to connect to prod api
const basePath =
  "https://l8xtnkax5h.execute-api.us-east-1.amazonaws.com/dev/netify";

const post = async (path, body, headers) => {
  console.log("req body");
  console.log(body);
  console.log(headers);

  try {
    const res = await fetch(path, {
      method: "post",
      body: JSON.stringify(body),
      headers: headers,
    });
    return res;
  } catch (e) {
    console.log(e);
    throw e;
  }
};

const get = async (path, headers) => {
  try {
    const res = await fetch(path, {
      method: "get",
      headers: headers,
    });
    return res;
  } catch (e) {
    console.log(e);
    throw e;
  }
};

const put = async (path, body, headers) => {
  try {
    const res = await fetch(path, {
      method: "put",
      body: JSON.stringify(body),
      headers: headers,
    });
    return res;
  } catch (e) {
    console.log(e);
    throw e;
  }
};

const del = async (path, headers) => {
  try {
    const res = await fetch(path, {
      method: "delete",
      headers: headers,
    });
    return res;
  } catch (e) {
    console.log(e);
    throw e;
  }
};

const N3tifyService = {
  login: async (req) => {
    return await post(`${basePath}/login`, req.body, {
      "Content-Type": "application/json",
    });
  },

  createUser: async (req) => {
    return await post(`${basePath}/users`, req.body, {
      "Content-Type": "application/json",
    });
  },

  editUser: async (req) => {
    return await put(`${basePath}/users`, req.body, {
      "Content-Type": "application/json",
    });
  },

  createMessage: async (req) => {
    return await post(`${basePath}/messages`, req.body, {
      "Content-Type": "application/json",
    });
  },

  getMessages: async (req) => {
    return await get(`${basePath}/messages`, {});
  },

  getUsers: async (req) => {
    return await get(`${basePath}/users`, {});
  },

  deleteUser: async (req) => {
    return await del(`${basePath}/users/${req.user_id}`, {});
  },
};

export default N3tifyService;
