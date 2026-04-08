<script setup lang="ts">

</script>

<template>
    <div class="h-screen text-white w-full">
        <div class="flex flex-col space-y-5 items-center">
            <h1 class="font-montserratAlt font-bold text-white text-6xl pt-50">Toute nos <span class="text-primary">émissions</span></h1>
            <p class="">Sur cette page, vous pouvez visionner toute nos émissions présent sur YouTube</p>
        </div>
        <section class="max-w-6xl mx-auto px-8 py-16">
            <VideoGrid :limit="12" show-pagination />
        </section>
    </div>
</template>