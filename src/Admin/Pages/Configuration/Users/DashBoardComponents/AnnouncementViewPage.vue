<template>
  <!--News part full details start-->
  <div class="col-sm-12 col-lg-12 np p-0">
    <v-card>
      <div class="card-header-tab card-header">
        <div
          class="card-header-title font-size-lg text-capitalize font-weight-bold"
        >
          {{ $t("announcement") }}
          
           
        </div>

        <v-spacer> </v-spacer>
         <div class="d-block  card-footer">
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <div v-on="on" class="d-inline-block mr-2">
                    <v-btn small @click="$router.go(-1)" class="secondary">
                      {{ $t("cancel") }}
                    </v-btn>
                  </div>
                </template>
                <span>{{ $t("cancel") }}</span>
              </v-tooltip>
            </div>
         
      </div>
      <div class="p-0 card-body">
        <div class="row">
          <div class="col-sm-3" style="border-right: 1px solid #dddddd">
            <div>
              <h6
                class="text-muted text-uppercase font-size-md opacity-9 text_align mb-2 ml-4 font-weight-normal"
              >
                {{ $t("latest_announcement") }}
              </h6>
            </div>
            <div class="scroll-area-lg">
              <ul
                class="todo-list-wrapper list-group list-group-flush"
                id="myUL"
              >
                <li
                  class="list-group-item"
                  v-for="(
                    announcemnt_details, announcemnt_index
                  ) in announcement_array"
                  :key="announcemnt_index"
                >
                  <div class="todo-indicator bg-warning"></div>
                  <div class="widget-content p-0">
                    <div class="widget-content-wrapper">
                      <div   @click="
                              gotodetails(
                                announcemnt_details,
                                announcemnt_details.id
                              )
                            " class="widget-content-left w-100">
                        <div class="d-flex justify-content-between">
                          <div
                            class="widget-heading announcemtn_detail_content"
                          
                            v-bind:class="{
                              'is-active':
                                announcemnt_details.id == activeIndex,
                            }"
                          >
                            <!-- v-bind:class="{
                'is-active': announcemnt_details.id == activeIndex,
              }" -->
                            {{ announcemnt_details.title }}
                          </div>
                          <div>
                            <span class="float-right">
                              <v-tooltip
                                bottom
                                v-if="announcemnt_details.document_upload"
                              >
                                <template v-slot:activator="{ on }">
                                  <span>
                                    <a
                                      :href="
                                        document_url +
                                        announcement.document_upload
                                      "
                                      download
                                    >
                                      <v-icon color="blue" v-on="on" medium
                                        >mdi-download</v-icon
                                      ></a
                                    ></span
                                  >
                                </template>
                                <span>{{ $t("download_attachment") }}</span>
                              </v-tooltip>
                            </span>
                          </div>
                        </div>
                        <!-- v-bind:class="{
                            'badge-circular':
                              announcemnt_details.content.shortname === 'News',
                          }" -->
                        <div
                          v-if="announcemnt_details.content"
                          class="announcemtn_detail_content"
                          v-html="announcemnt_details.content"
                        >
                        </div>
                        <div v-else>
                          {{ no_data_available }}
                        </div>
                        <!-- <div
                  class=" text-end badge-info badge"
                >
                  {{ $t("published_on") }}
                  {{ announcement.created_at | formatDate }}
                </div> -->
                      </div>
                      <!-- <div class="widget-content-right  p-2 " v-bind:class="{'badge-circular': news_notice.content.shortname === 'News'}" > {{news_notice.content.shortname}} </div> -->
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
          <div class="col-sm-9 np">
            <VueElementLoading
              :active="loader"
              spinner="bar-fade-scale"
              color="var(--primary)"
            />
            <div v-if="announcement == ''"></div>

            <div v-else class="p-1 slick-slider-sm mx-auto">
              <!--Slide row one start-->
              <div class="widget-chart widget-chart2 text-left p-0">
                <!-- <div class="mt-6 p-2 mb-8 badge-info badge">
                  {{ announcement }}
                </div> -->
                <div
                  class="mt-6 mb-8 mr-5 p-2 published_on badge-info badge text-right"
                >
                  {{ $t("published_on") }}
                  {{ announcement.created_at | formatDate }}
                </div>
                <h4 class="pl-3 pr-3 pt-3 mb-4 text-start font-weight-bold">
                  {{ announcement.title }}
                </h4>

                <div>
                  <div class="col-sm-12">
                    <center></center>
                  </div>

                  <div class="col-sm-12" style="text-align: initial">
                    <div class="ql-editor">
                      <p class="pr-4 quill-content text-initial" v-html="announcement.content">

                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </v-card>
  </div>
  <!--News part details end-->
</template>

<script>
import axios from "axios";
// import Slick from "vue-slick";
import VueElementLoading from "vue-element-loading";

export default {
  components: {
    // Slick,
    VueElementLoading,
  },
  data: () => ({
    document_url: process.env.VUE_APP_IMAGE_PATH,
    loader: false,
    announcement: "",
    user: "",
    announcement_array: [],
    activeIndex: null,
    heading: "",
    google_icon: {
      icon_name: "badge",
      color: "google_icon_gradient",
      icon: "material-symbols-outlined",
    },
  }),

  watch: {
    "$route.query.slug": {
      immediate: true,
      handler() {
        if (this.$route.query.slug) {
          this.activeIndex = this.$route.query.id;

          this.user = JSON.parse(localStorage.getItem("user"));
          this.loader = true;
          axios
            .get(process.env.VUE_APP_API_URL_ADMIN + "fetch_announcement", {
              params: {
                slug: this.$route.query.slug,
                // announcement_view: 'announcement_view',
                site_id: this.user.hr_employee.site_id,
                org_id: this.user.hr_employee.org_id,
              },
            })
            .then((res) => {
              this.announcement = res.data.announcement_details;
              this.announcement_array = res.data.announcement_array;
              this.loader = false;
            });
        }
      },
    },
  },

  methods: {
    gotodetails(announcemnt_details, index) {
      this.loader = true;
      //this.isOpen = !this.isOpen;
      this.activeIndex = index;
      this.announcement = announcemnt_details;
      this.loader = false;
    },
  },
};
</script>


<style scoped>
.selected {
  cursor: pointer;
  padding: 0 0 3px 0;
  color: #3f6ad8;
}

.list-group-item:hover {
  cursor: pointer;
  color: #3f6ad8;
}
.text_align {
  margin-top: 10px;
}
.published_on {
  float: right;
}
.contentType {
  color: #eb4c0eba;
  font-size: medium;
  font-style: oblique 13deg;
  font-weight: bolder;
}
.contentType_news {
  color: #127e8f;
  font-size: medium;
  font-style: oblique 13deg;
  font-weight: bolder;
}
.badge-news {
  color: #fff;
  background-color: #eb4c0eba;
}
.badge-circular {
  color: #fff;
  background-color: #127e8f;
}
.w-100 {
  width: 100%;
}
.badge {
  font-weight: bold;
  text-transform: uppercase;
  padding: 8px 10px;
  min-width: 19px;
}
.display {
  text-align: left;
}
.font_design {
  text-transform: none !important;
  font-weight: normal !important;
}
.is-active {
  color: #127e8f !important;
}
.announcemtn_detail_content {
  padding: 5px;
  text-overflow: ellipsis;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
</style>
