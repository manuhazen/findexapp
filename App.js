import { StatusBar } from "expo-status-bar";
import React, { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import * as BackgroundFetch from "expo-background-fetch";
import * as TaskManager from "expo-task-manager";
import * as Permissions from "expo-permissions";
import * as Notifications from "expo-notifications";

const BACKGROUND_FETCH_TASK = "findex_signal_alert";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

async function allowsNotificationsAsync() {
  const settings = await Notifications.getPermissionsAsync();
  return (
    settings.granted ||
    settings.ios?.status === Notifications.IosAuthorizationStatus.PROVISIONAL
  );
}

TaskManager.defineTask(BACKGROUND_FETCH_TASK, async () => {
  Notifications.scheduleNotificationAsync({
    content: {
      title: "Time's up!",
      body: "Change sides!",
    },
    trigger: {
      seconds: 0,
    },
  });
  await fetch("https://prodailyfx.com/custom/alerts/get");
  console.log(BACKGROUND_FETCH_TASK, "running");
  return BackgroundFetch.Result.NewData;
});

export default function App() {
  useEffect(() => {
    const initBackgroundFetch = async () => {
      if (notificationPermission.status === "granted") {
        const registered = await TaskManager.isTaskRegisteredAsync(
          BACKGROUND_FETCH_TASK
        );
        if (registered) {
          console.log("registered");
        }
      }
    };
    initBackgroundFetch();
    Notifications.scheduleNotificationAsync({
      content: {
        title: "Time's up!",
        body: "Change sides!",
      },
      trigger: {
        seconds: 3,
      },
    });
  }, []);
  return (
    <View style={styles.container}>
      <Text>Findex Notifications</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
