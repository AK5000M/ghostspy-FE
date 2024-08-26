import { useCallback, useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Divider,
  Input,
  TextField,
  Unstable_Grid2 as Grid
} from '@mui/material';
import jsCookie from 'js-cookie';
import { useContext } from 'react';
import { AuthContext } from 'src/contexts/auth-context';
import toast, { Toaster } from 'react-hot-toast'
export const OverViewCreateUser = () => {
  const [ loading, setLoading ] = useState(false);
    const [ queue, setQueue ] = useState(null);
    var token = jsCookie.get('token')
    const { user } = useContext(AuthContext);
    const [ data, setData ] = useState(null);

    useEffect(() => {
        if (!user?.is_admin)
            return;

        updateData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])

    function updateData() {
        setLoading(true);

        fetch('https://api.droidweb.net/admin/data', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token,
            },
        }).catch(() => {
            toast.error('Erro ao conectar com o servidor!');
            setLoading(false);
        }).then((res) => res.json()).then((res) => {
            console.log(res)
            if (res.status == 'error') {
                toast.error(res.message);
                setLoading(false);
            } else if (res?.status == 'success' && res?.data) {
                setData(res.data);
                setLoading(false);
            }
        });
    }

    function handlerDeleteUser(e, id) {
        e.preventDefault();

        setLoading(true);

        fetch('https://api.droidweb.net/user/delete', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token,
            },
            body: JSON.stringify({
                id: id,
            }),
        }).catch((_) => {
            toast.error('Erro ao conectar com o servidor!');
            setLoading(false);
        }).then((res) => res.json()).then((res) => {
            if (res.status == 'error') {
                toast.error(res.message);
                setLoading(false);
            } else if (res?.status == 'success') {
                toast.success('Usuário deletado com sucesso!');
                updateData();
            }
        });
    }


    function handlerCreateUser(e) {
        e.preventDefault();

        setLoading(true);

        const select = document.getElementById("acesso");
        const selectSpartan = document.getElementById("spartanoption");
        const senha = document.getElementById('senha').value;
        const usuario = document.getElementById('usuario').value;
        var telaRemota = false;
        let expirationAt = Date.now() / 1000;
        
        switch (select.options[select.selectedIndex].value) {
          case '3dias':
                expirationAt += 3 * 24 * 60 * 60;
            break;
            case '1semana':
                expirationAt += 7 * 24 * 60 * 60;
            break;
            case 'vitalicio':
                expirationAt += 999 * 24 * 60 * 60;
            break;
            case '1mes':
                expirationAt += 30 * 24 * 60 * 60;
            break;
        }

        switch (selectSpartan.options[selectSpartan.selectedIndex].value) {
          case 'remotaon':
              telaRemota = true;
          break;
          case 'remotaoff':
            telaRemota = false;
          break;
      }


        if (usuario === '' || senha === '') {
            toast.error('Preencha todos os campos!');
            setLoading(false);
            return;
        }

        if (usuario.length < 3 || senha.length < 3) {
            toast.error('Usuário ou senha inválidos!');
            setLoading(false);
            return;
        }

        fetch('https://api.droidweb.net/user/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token,
            },
            body: JSON.stringify({
                name: usuario,
                password: senha,
                expires_at: Math.round(expirationAt),
                spartan: telaRemota
            }),
        }).catch((_) => {
            toast.error('Erro ao conectar com o servidor!');
            setLoading(false);
        }).then((res) => res.json()).then((res) => {
            if (res.status == 'error') {
                toast.error(res.message);
                setLoading(false);
            } else if (res?.status == 'success') {
                toast.success('Usuário criado com sucesso!');
                updateData();
                setLoading(false);
            } else {
                toast.error('Erro ao criar usuário!');
                setLoading(false);
            }
        });
    }


  return (
      <Card>
        <CardHeader
          subheader=""
          title="Criar acesso"
        />
        <CardContent sx={{ pt: 0 }}>
          <Box sx={{ m: -1.5 }}>
            <Grid
              container
              spacing={3}
            >
              <Grid
                xs={12}
                md={6}
              >
                <TextField
                  fullWidth
                  label="Usuário"
                  id='usuario'
                  name="usuario"
                  required
                />
              </Grid>
              <Grid
                xs={12}
                md={6}
              >
                <TextField
                  fullWidth
                  label="Senha"
                  name="senha"
                  id='senha'
                  required
                />
              </Grid>
              <Grid
                xs={12}
                md={6}
              >
                <select className='form-control bg-light border-0' data-choices data-choices-search-false data-choices-removeItem id='acesso'>
                    <option value='3dias'>3 Dias</option>
                    <option value='1semana'>1 Semana</option>
                    <option value='1mes'>1 Mês</option>
                    <option value='vitalicio'>Vitalicio</option>
                </select>

                <select className='form-control bg-light border-0' data-choices data-choices-search-false data-choices-removeItem id='spartanoption'>
                    <option value='remotaon'>TELA REMOTA ON</option>
                    <option value='remotaoff'>TELA REMOTA OFF</option>
                </select>

              </Grid>
              <Grid
                xs={12}
                md={6}
              >
              </Grid>
            </Grid>
          </Box>
        </CardContent>
        <Divider />
        <CardActions sx={{ justifyContent: 'flex-end' }}>
          <Button variant="contained" onClick={(e) => handlerCreateUser(e)} className={ loading && 'btn btn-primary disabled' || 'btn btn-primary'}>
            CRIAR ACESSO
          </Button>
        </CardActions>
      </Card>
  );
};
