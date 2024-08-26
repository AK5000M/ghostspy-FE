import Head from "next/head";
import { Box, Container, Stack, Typography } from "@mui/material";
import { SettingsNotifications } from "src/sections/settings/settings-notifications";
import { SettingsPassword } from "src/sections/settings/settings-password";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";

const Page = () => (
  <>
    <Head>
      <title>Tutorial | GHOSTSPY</title>
    </Head>
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        py: 8,
      }}
    >
      <Container maxWidth="lg">
        <Stack spacing={3}>
          <Typography variant="h4">Tutoriais</Typography>

          <a
            href="https://www.mediafire.com/file/155m8znlv2p1c58/bypass.zip/file"
            className="btn btn-primary"
            style={{ fontSize: 15 }}
          >
            {" "}
            BAIXAR BURLADOR PLAY PROTECT{" "}
          </a>
          <br></br>
          <br></br>
          <br></br>
          <div className="row">
            <p>INSTALAÇÃO EM APARELHOS MOTOROLA</p>
            <iframe
              width="1280"
              height="720"
              src="https://www.youtube.com/embed/PGU6B3H-XBg?si=fmf0ovIjIuW7ycmI"
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            ></iframe>
            <br></br>
            <p>INSTALAÇÃO EM APARELHOS SAMSUNG</p>
            <iframe
              width="1280"
              height="720"
              src="https://www.youtube.com/embed/bRXzs37IXA0?si=pFH30k1QFmWNUHpi"
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            ></iframe>{" "}
            <br></br>
          </div>
        </Stack>
      </Container>
    </Box>
  </>
);

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
