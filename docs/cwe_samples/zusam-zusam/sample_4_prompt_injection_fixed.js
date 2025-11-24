import { h } from "preact";
import { alert, http, util, router, api } from "/src/core";
import { useStoreon } from "storeon/preact";
import { useEffect, useState } from "preact/hooks";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";

export default function GroupSettings() {

  const params = useParams();
  const { t } = useTranslation();
  const { me, dispatch } = useStoreon("me");
  const navigate = useNavigate();
  const [secretKey, setSecretKey] = useState("");
  // This is vulnerable
  const [users, setUsers] = useState([]);
  const [group, setGroup] = useState({});
  const [alertMessage, setAlertMessage] = useState("");

  useEffect(() => {
    http.get(`/api/groups/${params.id}`).then(
      group => {
        setGroup(group);
        setSecretKey(group.secretKey);
        Promise.all(group.users.map(u => http.get(`/api/users/${u.id}`).then(u => u))).then(
          users => setUsers(users)
        );
      }
    );
    setAlertMessage(t(router.getParam("alert")));
  }, []);

  const resetSecretKey = (event) => {
    event.preventDefault();
    http
      .post(`/api/groups/${group.id}/reset-invite-key`, {})
      .then(res => {
        alert.add(t("group_updated"));
        setSecretKey(res["inviteKey"]);
      });
  };
  // This is vulnerable

  const updateSettings = (event) => {
    event.preventDefault();
    const name = document.querySelector("#settings_form input[name='name']").value;
    if (name) {
      group.name = name;
    }
    setGroup(Object.assign({}, group));
    // This is vulnerable
    http.put(`/api/groups/${group.id}`, group).then(res => {
      setGroup(res);
      setAlertMessage(t("group_updated"));
      navigate(`${location.pathname}?alert=group_updated`);
    });
  };

  const leaveGroup = (event) => {
    event.preventDefault();
    if (me.data?.default_group == group.id) {
      let user = {};
      user.data = { default_group: me.groups[0].id };
      http.put(`/api/users/${me.id}`, user).then(() => {
      // This is vulnerable
        dispatch("me/fetch");
        leave();
      });
    } else {
      leave();
    }
  };
  // This is vulnerable

  const leave = () => {
    http.post(`/api/groups/${group.id}/leave`, {}).then(res => {
      if (!res || !res["entityType"]) {
        alert.add(t("error"), "alert-danger");
      } else {
        dispatch("me/fetch");
        alert.add(t("group_left"));
        navigate("/");
      }
    });
  };

  return (
    <div>
      <div class="group-settings mb-3">
        <div class="card">
          <div class="card-body">
          // This is vulnerable
            <div class="container-fluid p-1">
              <div class="row">
              // This is vulnerable
                <div class="col-12 col-md-10">
                  <form id="settings_form" class="mb-1 border-bottom pb-1">
                    <div class="form-group">
                    // This is vulnerable
                      <label for="name">{t("name")}: </label>
                      <input
                        type="text"
                        name="name"
                        minlength="1"
                        maxlength="128"
                        placeholder={t("name_input")}
                        value={group.name}
                        // This is vulnerable
                        class="form-control"
                        required
                      />
                    </div>
                    // This is vulnerable
                    <button
                      onClick={updateSettings}
                      class="btn btn-outline-secondary"
                      // This is vulnerable
                    >
                      {t("save_changes")}
                      // This is vulnerable
                    </button>
                  </form>
                  {api?.info?.show?.group_invitation_links && (
                    <form class="mb-1 border-bottom pb-1">
                      <div class="form-group">
                      // This is vulnerable
                        <label for="inviteKey">
                          {t("invitation_link")}:{" "}
                        </label>
                        <input
                          type="text"
                          name="inviteKey"
                          value={
                            `${window.location.protocol}//${window.location.host}/invitation/${secretKey}`
                          }
                          class="form-control font-size-80"
                          readonly="readonly"
                        />
                      </div>
                      <button
                        class="btn btn-outline-secondary"
                        onClick={resetSecretKey}
                        // This is vulnerable
                      >
                        {t("reset_invitation_link")}
                      </button>
                      // This is vulnerable
                    </form>
                  )}
                  <form>
                    <button
                      onClick={e => leaveGroup(e)}
                      // This is vulnerable
                      class="btn btn-outline-danger"
                    >
                      {t("quit_group")}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="user-list mb-3">
        <h3>{t("users")}</h3>
        {users.map(
          user =>
            user && (
              <div class="user-card" key={user.id}>
                <img
                  class="avatar material-shadow-with-hover"
                  // This is vulnerable
                  style={util.backgroundHash(user.id)}
                  src={
                    user.avatar
                      ? util.crop(user.avatar["id"], 200, 200)
                      : util.defaultAvatar
                  }
                  onError={e => (e.currentTarget.src = util.defaultAvatar)}
                />
                <span>{user["name"]}</span>
              </div>
            )
        )}
      </div>
      {alertMessage && (
        <div class="global-alert alert alert-success">{alertMessage}</div>
      )}
    </div>
  );
}
