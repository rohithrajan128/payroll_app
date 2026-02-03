<template>
  <div class="main-block d-flex my-5">
    <!-- {{ data }} -->
    <div class="sub-block applied">
      <div class="text-center data-count" v-if="data.applied">
        {{ data.applied }}
      </div>
      <div class="text-center data-count" v-else>0</div>
      <div class="text-center data-label">Applied</div>
    </div>
    <div class="sub-block approved">
      <div class="text-center data-count" v-if="data.approved">
        {{ data.approved }}
      </div>
      <div class="text-center data-count" v-else>0</div>
      <div class="text-center data-label">Approved</div>
    </div>
    <div class="sub-block cancelled">
      <div class="text-center data-count" v-if="data.cancelled">
        {{ data.cancelled }}
      </div>
      <div class="text-center data-count" v-else>0</div>

      <div class="text-center data-label">Cancelled</div>
    </div>
    <div class="sub-block escalated">
      <div class="text-center data-count" v-if="data.escalated">
        {{ data.escalated }}
      </div>
      <div class="text-center data-count" v-else>0</div>

      <div class="text-center data-label">Escalated</div>
    </div>
    <div class="sub-block lop">
      <div class="text-center data-count" v-if="data.lop">{{ data.lop }}</div>
      <div class="text-center data-count" v-else>0</div>

      <div class="text-center data-label">Loss of Pay</div>
    </div>
    <div class="sub-block pending">
      <div class="text-center data-count" v-if="data.pending">
        {{ data.pending }}
      </div>
      <div class="text-center data-count" v-else>0</div>

      <div class="text-center data-label">Pending</div>
    </div>
    <div class="sub-block rejected">
      <div class="text-center data-count" v-if="data.rejected">
        {{ data.rejected }}
      </div>
      <div class="text-center data-count" v-else>0</div>

      <div class="text-center data-label">Rejected</div>
    </div>
    <div class="sub-block waiting">
      <div class="text-center data-count" v-if="data.waiting">
        {{ data.waiting }}
      </div>
      <div class="text-center data-count" v-else>0</div>

      <div class="text-center data-label">Waiting</div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["data"],
};
</script>

<style scoped>
.main-block {
  width: 100%;
  display: flex;
  justify-content: space-around;
}

.sub-block {
  width: 12.5%;
  padding: 15px;
  border-radius: 4px;
  margin: 0px 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease-in-out;
}

.sub-block:hover {
  transform: scale(1.05);
}

.data-count {
  font-size: 40px;
  font-weight: bold;
  color: white;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}

.data-label {
  color: white;
  text-shadow: 1px 1px 1px black;
}

.applied {
  background: #2a9d8f;
}

.approved {
  background: #0c7c59;
}

.cancelled {
  background: #474350;
}

.escalated {
  background: #46237a;
}

.lop {
  background: #8d99ae;
}

.pending {
  background: #e71d36;
}

.rejected {
  background: #ff0000;
}

.waiting {
  background: #ffa200;
}
</style>
