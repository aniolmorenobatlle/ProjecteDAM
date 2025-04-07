import React, { useRef } from "react";
import EditProfile from "./FirstTab/EditProfile";
import SearchModalize from "./FirstTab/SearchModalize";

export default function FirstTabModalize({
  userInfo,
  newName,
  setNewName,
  newUsername,
  setNewUsername,
  poster,
  setIndex,
  setIsModalOpen,
  setIsModalizeOpen,
  modalizeRef,
  filledFavorites,
  fetchFavorites,
}) {
  const modalizeRef2 = useRef(null);

  const onOpen = () => {
    modalizeRef2.current?.open();
  };

  const handleClose = () => {
    modalizeRef.current?.close();
    setIsModalizeOpen(false);
    setIsModalOpen(false);
    setIndex(0);
  };

  return (
    <>
      <EditProfile
        userInfo={userInfo}
        newName={newName}
        setNewName={setNewName}
        newUsername={newUsername}
        setNewUsername={setNewUsername}
        poster={poster}
        filledFavorites={filledFavorites}
        setIndex={setIndex}
        onOpen={onOpen}
        fetchFavorites={fetchFavorites}
        handleClose={handleClose}
      />

      <SearchModalize
        userInfo={userInfo}
        modalizeRef={modalizeRef2}
        fetchFavorites={fetchFavorites}
      />
    </>
  );
}
