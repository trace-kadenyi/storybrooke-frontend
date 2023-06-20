import React from "react";
import MainNavbar from "../../Navigation/MainNavbar";

const DeleteAccount = () => {
  return (
    <section className="delete_acc_sect">
      <MainNavbar />
      <div className="delete_acc_main">
        <>
          <p className="sad_emoji">🥺</p>
          <p className="goodbye">We're sorry to see you go...</p> <br />
          <p className="goodbye_text">
            All your data will be deleted from our database (except anonymous
            stories). If you published any stories with us, we advice you to
            back them up just in case you need to use them in the future.
          </p>
        </>
        <div>
          <button className="delete_account_permanently">Delete Account Permanently</button>
        </div>
      </div>
    </section>
  );
};

export default DeleteAccount;
