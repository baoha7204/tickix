import "bootstrap/dist/css/bootstrap.min.css";
import Header from "../components/Header";
import buildClient from "./_utils/build-client";

const AppComponent = ({ Component, pageProps, currentUser }) => {
  return (
    <div>
      <Header isAuth={!!currentUser} />
      <div className="container">
        <Component currentUser={currentUser} {...pageProps} />
      </div>
    </div>
  );
};

AppComponent.getInitialProps = async ({ Component, ctx }) => {
  const client = buildClient(ctx);
  const { data } = await client.get("/api/users/current-user");
  let pageProps = {};
  if (Component.getInitialProps) {
    pageProps = await Component.getInitialProps(ctx, client, data.currentUser);
  }
  return { pageProps, ...data };
};

export default AppComponent;
