<!-- This file displays all events of a particular category.  Ex. events/category/Past  would display all events in the past -->
<script lang="ts">
  import Layout from "../../../banner-layout.svelte";
  import { onMount } from "svelte";
  import Card from "../../ListEventCard.svelte";
  import CatCard from "../../CategoryEventCard.svelte";
  import type { Event, RelevantEvents } from "../../../../interfaces";
  export let data;
  let { supabase, events, relevantEvents, category } = data;
  $: ({ supabase, events, relevantEvents, category } = data);

  let loading = true; // Boolean that determines if the page is still loading
  let currentIndex = 0; // Index of the first event to be displayed on the page
  let pageNum = 1; // The current page number
  let loadedEvents: Event[] = []; // Array of events that should be displayed on the page
  let totalPages = 0; // Total number of pages for that catgeory
  let pagesLeft: boolean = false; // Boolean that determines if there are more pages left to be displayed

  // this runs after the component firt renders in the DOM
  onMount(async () => {
    relevantEvents.forEach((event) => {
      event.Description = trimDescription(event.Description); // Trim the description of each event
    });
    totalPages = calculatePages(); // Calculate the number of pages that should be displayed
    loadEventsArray(); // Load the events array when the page first loads
    loading = false; // Set loading to false after fetching the events
  });
  // This function trims the description of an event to 140 characters
  function trimDescription(description: string) {
    if (description.length > 140) {
      return description.slice(0, 140) + "...";
    }
    return description;
  }

  // This function is called when the page first loads.  It loads the first <= 8 events into the loadedEvents array 
  function loadEventsArray() {
    relevantEvents.forEach((event, index) => {
      if (index >= currentIndex && index < currentIndex + 8) {
        loadedEvents.push(event);
      }
    });
    checkPagesLeft(); // Check if there are more pages left to be displayed.  This function sets the pagesLeft variable
  }
  function checkPagesLeft() {
    if (pageNum + 1 <= totalPages) {
      pagesLeft = true;
    } else {
      pagesLeft = false;
    }
    console.log("pages left: ", pagesLeft, "pageNum: ", pageNum, "totalPages: ", totalPages);
  }
  // This function calculates the number of pages that should be displayed based on the number of events
  function calculatePages() {
    return Math.ceil(relevantEvents.length / 8);
  }

  // This function is called when the user clicks on the next page button
  function loadNextEvents() {
    if (pagesLeft) {
      loadedEvents = [];
      currentIndex += 8;
      checkPagesLeft();
      pageNum += 1;
      loadEventsArray();
    }
  }
  // This function is called when the user clicks on the previous page button
  function loadPreviousEvents() {
    loadedEvents = [];
    currentIndex -= 8;
    checkPagesLeft();
    pageNum -= 1;
    loadEventsArray();
  }
</script>

<svelte:head>
  <title>Events | DamFit</title>
</svelte:head>

<Layout>
  <div class="flex items-center justify-start ml-[16%] w-[20%] mt-1 grow-1">
    <a href="/events" style="margin-left: 10px;" class="mt-[2.65%]">
      <!-- Back button -->
      <svg width="18" height="14" viewBox="0 0 51 43" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M24.1251 42.4336C23.2836 42.4243 22.4765 42.0987 21.8646 41.5217L0.911133 21.1135L21.8646 0.705341C22.5076 0.308915 23.2685 0.147891 24.0172 0.249796C24.7659 0.351701 25.456 0.710211 25.9694 1.26403C26.4827 1.81785 26.7876 2.5326 26.8318 3.28607C26.876 4.03954 26.6568 4.78496 26.2117 5.39489L10.3011 21.1135L26.4726 36.8322C26.9461 37.2876 27.2708 37.8755 27.404 38.5185C27.5371 39.1616 27.4725 39.8298 27.2186 40.4356C26.9648 41.0413 26.5335 41.5563 25.9815 41.9128C25.4294 42.2694 24.7823 42.4509 24.1251 42.4336Z"
          fill="black"
        />
        <path
          d="M47.5996 24.3699H9.25746C8.39275 24.3699 7.56346 24.0268 6.95202 23.4161C6.34057 22.8054 5.99707 21.977 5.99707 21.1133C5.99707 20.2496 6.34057 19.4213 6.95202 18.8105C7.56346 18.1998 8.39275 17.8567 9.25746 17.8567H47.5996C48.4643 17.8567 49.2936 18.1998 49.9051 18.8105C50.5165 19.4213 50.86 20.2496 50.86 21.1133C50.86 21.977 50.5165 22.8054 49.9051 23.4161C49.2936 24.0268 48.4643 24.3699 47.5996 24.3699V24.3699Z"
          fill="black"
        />
      </svg>
    </a>
    <!-- Event Category name -->
    <h1 class=" ml-5 font-semibold text-xl" style="margin-top:9.8px; font-size:18px;">{category} Events</h1>
  </div>
  <!-- Display spinner when page isn't done loading -->
  {#if loading}
    <div role="status">
      <svg
        aria-hidden="true"
        class="ml-[55%] mt-[10%] inline w-10 h-10 text-gray-200 animate-spin dark:text-gray-600 fill-beaver-orange"
        viewBox="0 0 100 101"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
          fill="currentColor"
        />
        <path
          d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
          fill="currentFill"
        />
      </svg>
      <span class="sr-only">Loading...</span>
    </div>
  {:else}
    <!-- Else, display the events -->
    <div class="grid grid-cols-2 grid-rows-4 gap-1 container ml-[17%] w-auto h-[75%] mt-3">
      {#if relevantEvents.length > 0}
        {#each loadedEvents as event, index (event.EventID)}
          {#if index <= 7}
            <div class="flex justify-center items-center">
              <Card {...event} {index} />
            </div>
          {/if}
        {/each}
      {:else}
        <p>No events found</p>
      {/if}
    </div>
    <!-- Pagination buttons -->
    <div class="ml-[17%] w-auto flex justify-center items-center container mt-9 join">
      <button
        class:btn-disabled={pageNum == 1}
        class:bg-unavailable={pageNum == 1}
        class="class: join-item btn bg-light-black text-beaver-orange text-lg hover:bg-light-blackSelected"
        on:click={loadPreviousEvents}>«</button>
      <button class="join-item bg-light-black hover:bg-light-black btn text-white">Page {pageNum}</button>
      <button class:btn-disabled={!pagesLeft} class:unavailable={!pagesLeft} class="join-item btn bg-light-black text-beaver-orange text-lg hover:bg-light-blackSelected" on:click={loadNextEvents}>
        »
      </button>
    </div>
  {/if}
</Layout>


<style>
</style>

