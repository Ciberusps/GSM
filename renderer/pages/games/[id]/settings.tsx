import { useContext, useState } from "react";
import styled from "styled-components";
import { useRouter } from "next/router";

import Layout from "../../../components/Layout";
import Button from "../../../components/Button";
import FileInput from "../../../components/FileInput";
import GlobalContext from "../../../components/GlobalContext";

const GamePage = () => {
  const { state } = useContext(GlobalContext);
  const Router = useRouter();

  const id = Router.query?.id as string;
  const isEditing = id !== "new";
  const game = state?.games?.[id];

  const [exePath, setExePath] = useState<string | undefined>(game?.exePath);
  const [saves, setSaves] = useState<{ path: string; files: string[] } | undefined>(
    game?.saves
  );

  const onChooseExe = async () => {
    const newExePath = await ipcRenderer.invoke("chooseGameExe");
    // TODO: handle error
    if (newExePath) {
      console.log("ExePath added", newExePath);
      setExePath(newExePath);
    } else {
    }
  };

  const onChooseSavesPath = async () => {
    const newSaves = await ipcRenderer.invoke("chooseSavesPath");
    // TODO: handle error
    if (newSaves) {
      console.log("SavePath added", newSaves);
      setSaves(newSaves);
    }
  };

  const onSave = () => {
    if (!exePath || !saves) return;
    if (isEditing) {
      const isEdited = ipcRenderer.invoke("editGame", {
        game,
        exePath,
        saves,
      });
      console.log("game edited", isEdited);
    } else {
      const isCreated = ipcRenderer.invoke("createGame", {
        exePath,
        saves,
      });
      console.log("game created", isCreated);
    }
    Router.push(`/`);
  };

  const onRemove = () => {
    ipcRenderer.invoke("removeGame", game?.id);
    Router.push(`/`);
  };

  return (
    <Layout title="New Game">
      <h1>{isEditing ? game?.name : "Add game"}</h1>

      <FileInput label=".exe file" path={exePath} onClick={onChooseExe} />

      {exePath && (
        <FileInput
          label="Save file(s) path"
          path={saves?.path}
          isDisabled={!exePath}
          onClick={onChooseSavesPath}
        />
      )}

      <div>
        Files:
        {saves?.files?.map((file) => (
          <div>- {file}</div>
        ))}
      </div>

      <Button onClick={onSave}>Save</Button>
      <Button onClick={onRemove}>Remove game</Button>
    </Layout>
  );
};

export default GamePage;
