export const cartReducer = (state, action) => {
  switch (action.type) {
    case "ADD_TO_CART":
      const newItem = action.playload;
      console.log(newItem);
      // const findSameID = state.find((item) => item.id == newItem.id);
      // if (findSameID) {
      //   findSameID.amount += newItem.amount;
      //   findSameID.price += newItem.price;
      // } else {
      //   state.push(newItem);
      // }
      if (newItem.find((sth) => state.some((it) => it.id === sth.id))) {
        const updatedCart = state.map((item) => {
          let theSame = newItem.find((stuffs) => item.id === stuffs.id);
          if (theSame) {
            return {
              ...item,
              amount: item.amount + theSame.amount,
              total_price: item.total_price + theSame.total_price,
            };
          }

          return item;
        });

        return updatedCart;
      } else {
        return [...state, ...newItem];
      }

    case "Update_Cart":
      const used_forUpdate = action.playload;
      console.log(used_forUpdate);
      const update = state.map((item) => {
        let theSame = used_forUpdate.find((stuffs) => item.id === stuffs.id);
        if (theSame) {
          return theSame;
        }
        return item;
      });
      console.log(update);
      return update;
    case "Delete_Item":
      const stuff_toDelete = action.playload;
      console.log(stuff_toDelete);
      let updatedVersion = state.filter(
        (item) => item.id !== stuff_toDelete.id
      );

      console.log(updatedVersion);
      return updatedVersion;

    default:
      return action.playload;
  }
};
