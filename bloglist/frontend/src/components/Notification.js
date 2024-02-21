import { useSelector } from "react-redux";

const Notification = () => {
  const { message, isError } = useSelector((state) => state.notification);

  const style = {
    border: 'solid',
    padding: 10,
    borderWidth: 1,
  }

  if (!message) {
    return null;
  }

  return (
    <div style={style} className={isError ? "error" : "info"}>
      {message}
    </div>
  );
}

export default Notification;