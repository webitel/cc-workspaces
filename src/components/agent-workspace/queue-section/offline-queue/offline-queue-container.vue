<template>
  <section class="call-preview-wrap">
    <offline-preview
      v-for="(member, key) of membersList"
      :member="member"
      :key="key"
      @click.native.prevent="openCall(key)"
    ></offline-preview>
  </section>
</template>

<script>
  import { mapState, mapActions } from 'vuex';
  import OfflinePreview from './offline-queue-preview.vue';

  export default {
    name: 'offline-queue-container',
    components: {
      OfflinePreview,
    },
/* eslint-disable */ // FIXME
    data: () => ({
      membersList:[
        {
          "communications": [
            {
              "id": "0",
              "destination": "Hello",
              "type": {
                "id": "1",
                "name": "Домашний"
              },
              "priority": 10,
              "description": "\"Hello\"",
              "resource": null,
              "display": "",
              "state": 0,
              "last_activity_at": "0",
              "attempts": 0,
              "last_cause": ""
            }
          ],
          "skills": [],
          "variables": {
            "Hello": "Hello"
          },
          "id": "66",
          "queue": {
            "id": "14",
            "name": "Igor test"
          },
          "priority": 10,
          "expire_at": "20",
          "created_at": "1584663892453",
          "name": "Hello-66",
          "timezone": {
            "id": "365",
            "name": "Europe/Kiev"
          },
          "bucket": null,
          "min_offering_at": "0",
          "stop_cause": "ABANDONED",
          "last_activity_at": "0",
          "attempts": 0,
          "reserved": false
        },
        {
          "communications": [
            {
              "id": "0",
              "destination": "Hello",
              "type": {
                "id": "1",
                "name": "Домашний"
              },
              "priority": 10,
              "description": "\"Hello\"",
              "resource": null,
              "display": "",
              "state": 0,
              "last_activity_at": "0",
              "attempts": 0,
              "last_cause": ""
            }
          ],
          "skills": [],
          "variables": {
            "Hello": "Hello"
          },
          "id": "63",
          "queue": {
            "id": "14",
            "name": "Igor test"
          },
          "priority": 10,
          "expire_at": "20",
          "created_at": "1584663891308",
          "name": "Hello-63",
          "timezone": {
            "id": "365",
            "name": "Europe/Kiev"
          },
          "bucket": null,
          "min_offering_at": "0",
          "stop_cause": "ABANDONED",
          "last_activity_at": "0",
          "attempts": 0,
          "reserved": false
        },
        {
          "communications": [
            {
              "id": "0",
              "destination": "Hello",
              "type": {
                "id": "1",
                "name": "Домашний"
              },
              "priority": 10,
              "description": "\"Hello\"",
              "resource": null,
              "display": "",
              "state": 0,
              "last_activity_at": "0",
              "attempts": 0,
              "last_cause": ""
            }
          ],
          "skills": [],
          "variables": {
            "Hello": "Hello"
          },
          "id": "64",
          "queue": {
            "id": "14",
            "name": "Igor test"
          },
          "priority": 10,
          "expire_at": "20",
          "created_at": "1584663891805",
          "name": "Hello-64",
          "timezone": {
            "id": "365",
            "name": "Europe/Kiev"
          },
          "bucket": null,
          "min_offering_at": "0",
          "stop_cause": "ABANDONED",
          "last_activity_at": "0",
          "attempts": 0,
          "reserved": false
        }
      ],
    }),

    computed: {
      ...mapState('workspace', {}),
    },

    methods: {
      ...mapActions('workspace', {
        openCall: 'OPEN_CALL_ON_WORKSPACE',
      }),
    },
  };
</script>

<style lang="scss" scoped>

</style>
