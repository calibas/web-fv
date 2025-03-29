import { Suspense } from "react";
import {
  useLoaderData,
  // useSearchParams,
  Await,
  Outlet,
} from "react-router-dom";
// import { useAppDispatch } from "./hooks";
// import Menu from "./components/Menu";
// import { loadTextFile } from "./features/fileSlice";

interface User {
  name: string;
}

export default function Root() {
  // const dispatch = useAppDispatch();
  const { user } = useLoaderData() as { user: Promise<User> };
  // const [searchParams] = useSearchParams();
  // const loadUrl = searchParams.get("url");

  // useEffect(() => {
  //   console.log(loadUrl);
  //   if (loadUrl) dispatch(loadTextFile(loadUrl));
  // }, [dispatch, loadUrl]);

  return (
    <div>
      {/* <h1>Song List</h1> */}

      <Suspense fallback={<p>Loading...</p>}>
        <Await resolve={user}>
          {(resolvedUser) => (
            <div>
              <p style={{ display: "none" }}>Welcome, {resolvedUser.name}!</p>
              {/* <Menu /> */}
              <Outlet />
            </div>
          )}
        </Await>
      </Suspense>
    </div>
  );
}
