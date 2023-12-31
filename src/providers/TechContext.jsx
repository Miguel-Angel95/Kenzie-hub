import { useEffect, useState } from "react";
import { createContext } from "react";
import { toast } from "react-toastify";
import { api } from "../Services";

export const TechContext = createContext({});

export const TechProvider = ({ children }) => {
  const [listTech, setListTech] = useState([]);
  const [addModal, setAddModal] = useState(false);
  const [EditModal, setEditModal] = useState(false);
  const [attTecnologia, setattTecnologia] = useState(null);

  const userTech = async () => {
    try {
      const idUser = localStorage.getItem("@USERID");
      const response = await api.get(`/users/${idUser}`);
      setListTech(response.data.techs);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    userTech();
  }, []);

  const createTech = async (data) => {
    try {
      const UserToken = localStorage.getItem("@TOKEN");
      const response = await api.post("/users/techs", data, {
        headers: {
          Authorization: `Bearer ${UserToken}`,
        },
      });
      userTech();
      toast.success("Tecnologia criada com sucesso!");
    } catch (error) {
      console.log(error);
    }
  };

  const deleteTech = async (idTech) => {
    try {
      const UserToken = localStorage.getItem("@TOKEN");
      const response = await api.delete(`/users/techs/${idTech}`, {
        headers: {
          Authorization: `Bearer ${UserToken}`,
        },
      });

      const newDeleteList = listTech.filter((list) => list.id !== idTech);
      setListTech(newDeleteList);
      toast.warning("Tecnologia exluida!");
    } catch (error) {
      console.log(error);
    }
  };

  const attTech = async (idTech, data) => {
    try {
      const UserToken = localStorage.getItem("@TOKEN");
      const response = await api.put(`/users/techs/${idTech}`, data, {
        headers: {
          Authorization: `Bearer ${UserToken}`,
        },
      });
      const newListTech = listTech.map((list) => {
        if (idTech === list.id) {
          return { ...list, ...data };
        } else {
          return list;
        }
      });
      setListTech(newListTech);
      toast.success("Tecnologia atualizada!");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <TechContext.Provider
      value={{
        createTech,
        deleteTech,
        attTech,
        listTech,
        addModal,
        setAddModal,
        EditModal,
        setEditModal,
        attTecnologia,
        setattTecnologia,
      }}
    >
      {children}
    </TechContext.Provider>
  );
};
