import React from "react"
import Robot from "@freesewing/components/Robot";
import Blockquote from "@freesewing/components/Blockquote";

const SearchPage = ({ app }) => {

  const styles = {
    wrapper: {
      display: "flex",
      alignItems: "center",
      flexWrap: "wrap",
      justifyContent: "space-between"
    },
    robot: {
      width: "30%",
      margin: "auto"
    },
    note: {
      width: "calc(70% - 1rem)"
    }
  }
  if (app.frontend.mobile || app.frontend.tablet) {
    styles.robot.width = "300px";
    styles.note.width = "100%";
  }
  return (
    <div style={styles.wrapper}>
      <div style={styles.note}>
        <Blockquote type="note">
          <p>Unfortunately, search is still under construction.</p>
          <p>If you'd like to help us build this search page,
          please <a href="https://gitter.im/freesewing/freesewing">get in touch</a>.</p>
        </Blockquote>
      </div>
      <div style={styles.robot}>
        <Robot embed pose="shrug"/>
      </div>
    </div>
  );
}
export default SearchPage;
