import axios from "axios";
class AxiosFun {
  get(url, obj) {
    return axios.get(url, { params: obj });
  }
  post(url, obj) {
    return axios.post(url, obj);
  }
  getCurrentUser() {
    return JSON.parse(localStorage.getItem("user"));
  }
  getCart(a) {
    return JSON.parse(localStorage.getItem(a));
  }
  get_afterLogin(url, obj) {
    return axios.get(url, obj);
  }
  post_afterLogin(url, obj, obj2) {
    return axios.post(url, obj, obj2);
  }
  update(obj, obj2, id) {
    return axios.put(
      `http://localhost:3535/afterLogin/update_cart/` + id,
      obj,
      obj2
    );
  }
}

export default new AxiosFun();
