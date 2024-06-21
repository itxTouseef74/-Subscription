<template>
  <v-container class="mt-1">
    <v-col align="end">
      <v-btn variant="tonal" v-if="isLoggedIn" @click="logout()" color="red" class="mt-1"
        >Logout</v-btn
      ></v-col
    >
    <!-- <v-row>
      <v-col md="6" class="mx-auto">
        <v-card class="bg-green-accent-1">
          <v-card-title class="text-h6">
            <b>Create Notification</b>
          </v-card-title>
          <v-card-text>
            <div class="form-group">
              <v-text-field v-model="notification_name" label="Title" required></v-text-field>
              <v-text-field
                v-model="notification_description"
                label="Description"
                required
              ></v-text-field>
              <v-text-field
                v-model="notification_date"
                type="date"
                label="Task Date"
                required
              ></v-text-field>

              <v-select
                v-model="is_completed"
                :items="['Incomplete', 'Completed']"
                label="Status"
                required
              ></v-select>

              <v-btn @click="createNotification" color="success">Create Notification</v-btn>
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col md="6" class="mx-auto">
        <v-card class="bg-green-accent-1">
          <v-card-title class="text-h6">
            <b>Notification List</b>
          </v-card-title>
          <v-list class="bg-green-accent-1">
            <v-list-item v-for="Notification in Notifications" :key="Notification.uuid">
              <v-list-item-content>
                <v-list-item-title>
                  <b>Title:</b> {{ Notification.Notification_name }}
                </v-list-item-title>
                <v-list-item-subtitle>
                  <b>Description:</b> {{ Notification.Notification_description }}
                </v-list-item-subtitle>
                <v-list-item-subtitle>
                  <b>Task Date:</b>{{ Notification.Notification_date }}
                </v-list-item-subtitle>
                <v-list-item-subtitle
                  class="mb-1"
                  :style="{ color: displayStatusColor(Notification.is_completed) }"
                  ><b>Status:</b> {{ displayStatus(Notification.is_completed) }}
                </v-list-item-subtitle>
              </v-list-item-content>
              <v-list-item-action>
                <v-btn @click="deleteNotification(Notification.uuid)" color="red" class="mr-1"
                  >Delete Notification</v-btn
                >
                <v-btn @click="openUpdateDialog(Notification)" color="primary">Update</v-btn>
              </v-list-item-action>
            </v-list-item>
          </v-list>
        </v-card>
      </v-col>
    </v-row> -->
    <v-dialog v-model="showUpdateDialog" max-width="600">
      <v-card>
        <v-card-title class="text-h6">
          <b>Update Notification</b>
        </v-card-title>
        <v-card-text>
          <v-text-field
            v-model="updatedTask.Notification_name"
            label="Title"
            required
          ></v-text-field>
          <v-text-field
            v-model="updatedTask.Notification_description"
            label="Description"
            required
          ></v-text-field>
          <v-text-field
            v-model="updatedTask.Notification_date"
            label="Notification Date"
            type="date"
            required
          ></v-text-field>
          <v-select
            v-model="updatedTask.Notification"
            :items="['Incomplete', 'Completed']"
            label="Status"
            required
          ></v-select>
        </v-card-text>
        <v-card-actions>
          <v-btn @click="updateNotification" color="primary">Update</v-btn>
          <v-btn @click="closeUpdateDialog" color="red">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
export default {
  name: "Notification",
  data() {
    return {
      Notification_name: "",
      Notification_description: "",
      is_completed: "",
      Notification_date: "",
      Notifications: [],
      isLoggedIn: false,
      showUpdateDialog: false,
      updatedTask: {
        uuid: null,
        Notification_name: "",
        Notification_description: "",
        is_completed: "",
        Notification_date: "",
      },
    };
  },
  created() {
    if (localStorage.getItem("token")) {
      this.isLoggedIn = true;
    }
    this.getNotifications();
  },
  methods: {
    getNotifications() {
      const token = localStorage.getItem("token");
      const requestOptions = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };

      fetch(`${import.meta.env.VITE_API_BASE_URL}/api/Notification/`, requestOptions)
        .then((response) => response.json())
        .then((data) => {
          this.Notifications = data.data;
        })
        .catch((error) => {
          console.error("Error fetching Notifications:", error);
        });
    },
    createNotification() {
      const token = localStorage.getItem("token");
      const requestOptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          Notification_name: this.Notification_name,
          Notification_description: this.Notification_description,
          Notification_date: this.Notification_date,
          is_completed: this.is_completed === "Completed" ? true : false,
        }),
      };

      fetch(`${import.meta.env.VITE_API_BASE_URL}/api/Notification/`, requestOptions)
        .then((response) => response.json())
        .then((data) => {
          console.log("Notification created:", data);
          this.getNotifications();
        })
        .catch((error) => {
          console.error("Error creating Notification:", error);
        });
    },
    deleteNotification(uuid) {
      const token = localStorage.getItem("token");
      const requestOptions = {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ uuid: uuid }),
      };

      fetch(`${import.meta.env.VITE_API_BASE_URL}/api/Notification/delete/`, requestOptions)
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          this.getNotifications();
        });
    },
    openUpdateDialog(Notification) {
      this.showUpdateDialog = true;
      this.updatedTask = {
        ...Notification,
        Notification: Notification.is_completed ? "Completed" : "Incomplete",
      };
    },
    closeUpdateDialog() {
      this.showUpdateDialog = false;
    },

    updateNotification(uuid, is_completed) {
      const token = localStorage.getItem("token");
      const requestOptions = {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          uuid: this.updatedTask.uuid,
          Notification_name: this.updatedTask.Notification_name,
          Notification_description: this.updatedTask.Notification_description,
          Notification_date: this.updatedTask.Notification_date,
          is_completed: this.updatedTask.Notification === "Completed" ? true : false,
        }),
      };

      fetch(`${import.meta.env.VITE_API_BASE_URL}/api/Notification/`, requestOptions)
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          this.getNotifications();
          this.closeUpdateDialog();
        });
    },
    displayStatus(Notification) {
      return Notification ? "Completed" : "Incomplete";
    },
    displayStatusColor(isCompleted) {
      return isCompleted ? "green" : "red";
    },
    logout() {
      localStorage.removeItem("token");
      window.location.href = "/login";
    },
  },
};
</script>

<style>
body {
  background-color: rgb(239, 243, 246);
}
</style>
