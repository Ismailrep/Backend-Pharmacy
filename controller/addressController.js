import Address from "../models/AddressModel.js";
import Users from "../models/UserModel.js";

export const addAddress = async (req, res) => {
  const { name, address, user_id } = req.body;

  try {
    const response = await Address.create({
      name,
      address,
      user_id,
    });

    res.status(200).json({ response, msg: "Address added" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const getAddress = async (req, res) => {
  //   const { user_id } = req.body;
  try {
    const response = await Address.findAll({
      attributes: ["id", "name", "address", "is_deleted", "user_id"],
      where: {
        user_id: req.params.id,
      },
    });
    res.status(200).json({ response });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
