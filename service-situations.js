const situations = document.querySelector(".service-situations");

if (situations) {
  const tabList = situations.querySelector(".situations-tabs");
  const tabs = [...tabList.querySelectorAll("button")];
  const toggles = [...situations.querySelectorAll(".situations-toggle")];
  const panels = tabs.map((tab) => document.getElementById(tab.getAttribute("aria-controls")));
  const mobile = matchMedia("(max-width: 760px)");
  let selected = 0;

  function render() {
    tabList.hidden = mobile.matches;
    tabs.forEach((tab, index) => {
      const isSelected = index === selected;
      tab.tabIndex = isSelected ? 0 : -1;
      tab.setAttribute("aria-selected", String(isSelected));
      toggles[index].hidden = !mobile.matches;
      toggles[index].setAttribute("aria-expanded", String(isSelected));
      panels[index].hidden = !isSelected;
      panels[index].setAttribute("role", mobile.matches ? "region" : "tabpanel");
      panels[index].setAttribute("aria-labelledby", mobile.matches ? toggles[index].id : tab.id);
      panels[index].tabIndex = mobile.matches ? -1 : 0;
    });
  }

  function select(index) {
    if (mobile.matches && index === selected) {
      selected = -1;
      if (location.hash === "#" + panels[index].id) {
        history.replaceState(null, "", location.pathname + location.search);
      }
    } else {
      selected = index;
      const hash = "#" + panels[index].id;
      if (hash !== location.hash) history.replaceState(null, "", hash);
    }
    render();
  }

  function followAnchor() {
    const index = panels.findIndex((panel) => "#" + panel.id === location.hash);
    if (index >= 0) selected = index;
    render();
    if (index >= 0) {
      const target = mobile.matches ? toggles[index] : situations;
      target.scrollIntoView({ behavior: "instant", block: "start" });
    }
  }

  tabList.setAttribute("role", "tablist");
  tabList.setAttribute("aria-orientation", "vertical");
  tabs.forEach((tab, index) => {
    tab.setAttribute("role", "tab");
    tab.addEventListener("click", () => select(index));
    toggles[index].addEventListener("click", () => select(index));
    tab.addEventListener("keydown", (event) => {
      let next;
      if (event.key === "ArrowDown") next = (index + 1) % tabs.length;
      else if (event.key === "ArrowUp") next = (index + tabs.length - 1) % tabs.length;
      else if (event.key === "Home") next = 0;
      else if (event.key === "End") next = tabs.length - 1;
      else return;
      event.preventDefault();
      select(next);
      tabs[next].focus();
    });
  });
  mobile.addEventListener("change", () => {
    if (!mobile.matches && selected < 0) selected = 0;
    render();
  });
  window.addEventListener("hashchange", followAnchor);
  followAnchor();
}
