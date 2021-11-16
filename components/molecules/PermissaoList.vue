<template>
  <v-row>
    <v-col cols="12" md="12">
      <v-data-table
        no-data-text="No profile registered."
        :headers="headers"
        :items="roles"
        :loading="loading"
        :options.sync="options"
        loading-text="Loading..."
      >
        <template v-slot:[`item.action`]="{ item }">
          <v-tooltip top>
            <template v-slot:activator="{ on, attrs }">
              <v-btn v-on="on" v-bind="attrs" icon @click.stop="view(item.id)">
                <v-icon> mdi-magnify </v-icon>
              </v-btn>
            </template>
            <span>View</span>
          </v-tooltip>

          <v-tooltip top v-if="canEditPermission">
            <template v-slot:activator="{ on, attrs }">
              <v-btn v-on="on" v-bind="attrs" icon @click.stop="edit(item.id)">
                <v-icon> mdi-pencil </v-icon>
              </v-btn>
            </template>
            <span>Edit</span>
          </v-tooltip>

        </template>
      </v-data-table>
      <v-pagination
        v-model="options.page"
        :length="options.pageCount"
      ></v-pagination>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import Vue from 'vue'
import { auth } from '@/store'
import { $axios } from '@/utils/nuxt-instance'
import { screen } from '@/utils/store-access'
import { Mode, Module, Action } from '@/models'

export default Vue.extend({
  data() {
    return {
      options: {
        filter: '',
        pageCount: 0,
        page: 1,
        itemsPerPage: 10,
        totalItems: 0
      },
      loading: false,
      headers: [
        {
          text: 'Id',
          sortable: true,
          align: 'start',
          value: 'id',
        },
        {
          text: 'Profile name',
          sortable: true,
          align: 'start',
          value: 'name',
        },
        {
          text: 'Tag',
          sortable: true,
          align: 'start',
          value: 'tag',
        },
        {
          text: 'Options',
          sortable: false,
          align: 'center',
          value: 'action',
        },
      ],
      roles: [],
    }
  },
  methods: {
    add() {
      screen.setMode(Mode.ADD)
    },
    find() {
      this.loading = true

      $axios.$get(`/api/roles`)
        .then(r => {
          this.loading = false
          this.roles = r
        })
        .catch(error => {
          this.loading = false
        })
    },
    view(id: number) {
      screen.setMode(Mode.VIEW)
      this.$emit('id', id)
    },
    edit(id: number) {
      screen.setMode(Mode.EDIT)
      this.$emit('id', id)
    },
    delete(id: number) {
      screen.setMode(Mode.DELETE)
      this.$emit('id', id)
    }
  },
  computed: {
    isListMode() {
      return screen.$mode === Mode.LIST
    },
    canAddPermission() {
      const permissions = auth.$permissions
      return permissions.find(p => {
        return p.module === Module.ROLES &&
          (p.action === Action.ALL || p.action === Action.WRITE)
      })
    },
    canEditPermission() {
      const permissions = auth.$permissions
      return permissions.find(p => {
        return p.module === Module.ROLES &&
          (p.action === Action.ALL || p.action === Action.UPDATE)
      })
    }
  },
  watch: {
    isListMode: function(val) {
      if (val) {
        this.find()
      }
    }
  },
  created() {
    if (this.isListMode) {
      this.find()
    } else {
      screen.setMode(Mode.LIST)
    }
  }
})
</script>

<style lang="scss" scoped>
</style>
