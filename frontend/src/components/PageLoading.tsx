import { ProgressSpinner } from "primereact/progressspinner";

type PageLoadingProps = {
  loading: boolean;
};

const PageLoading: React.FC<PageLoadingProps> = ({ loading }) => {
  if (!loading) {
    return null;
  }

  return (
    <div className="absolute left-0 top-0 z-40 flex h-screen w-screen items-center justify-center bg-black/30">
      <ProgressSpinner
        className="z-50 h-20 w-20"
        strokeWidth="5"
        animationDuration="2s"
      />
    </div>
  );
};

export default PageLoading;
