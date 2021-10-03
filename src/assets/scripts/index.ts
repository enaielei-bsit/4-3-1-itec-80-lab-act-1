import dateFormat from "dateformat";
import "./../third-party/jquery/jquery.min.js";
import "./../third-party/semantic/semantic.min.js";

import Profile from "./profile.js";

class Page {
    static idPrefix = "profile";
    static profiles: Profile[] = [];
    static entriesChecked: string[] = [];

    static initialize(data: Profile[]) {
        $(() => {
            this.initializeNodes();
            this.setEntries(data);
            this.profiles = data;

        });
        
    }

    static initializeNodes() {
        let tab: any = $('.ui.menu .item');
        tab.tab();
        let progress: any = $('.ui.progress');
        progress.progress();
        let acc: any = $('.ui.accordion');
        acc.accordion({
            selector: {
              trigger: '.title .icon-label'
            }
        });
        ($('.ui.dropdown') as any).dropdown();
        ($('.ui.calendar') as any).calendar({
            type: 'date'
        });

        let modal: any = $(`#${this.idPrefix}-add-entry-modal`);
        modal.modal({
            blurring: true,
            onApprove: (e: any) => {
                

            }
        });

        let form = $(`#${this.idPrefix}-add-entry-modal .form`) as any;
        form.form({
            fields: {
                "given-name": "empty",
                "family-name": "empty",
                "sex": "empty",
                "birthdate": "empty",
                "height": "empty",
                "civil-status": "empty",
                "religion": "empty",
            }
        });
        let formSubmitBtn = form.find(".submit");
        formSubmitBtn.on("click", () => {
            if(form.form("is valid")) {
                let data = {
                    givenName: form.form("get value", "given-name"),
                    middleName: form.form("get value", "middle-name") ?? " ",
                    familyName: form.form("get value", "family-name"),
                    sex: form.form("get value", "sex"),
                    birthdate: form.form("get value", "birthdate"),
                    height: form.form("get value", "height").toString() + " cm",
                    civilStatus: form.form("get value", "civil-status"),
                    religion: form.form("get value", "religion"),
                };
                
                this.profiles.push(new Profile(data));
                let li = this.profiles.length - 1;
                (this.profiles[li] as any).entryClass = `entry-${li}`;
                modal.modal("hide");
                form.form("clear");
                Page.setEntries(this.profiles);
                Page.validateButtons();

            }

        })

        let toggleBtns: any = $(`.${this.idPrefix}-toggle-check-btn`);
        for(let btn of toggleBtns) {
            $(btn).on("click", () => {
                ($(`#main-container .checkbox`) as any).checkbox("toggle");
                
            });
            
        }

        let removeBtns: any = $(`.${this.idPrefix}-remove-entry-btn`);
        for(let btn of removeBtns) {
            $(btn).on("click", () => {
                let ecs = this.entriesChecked.values();
                for(let ec of ecs) {
                    $(`.${ec}`).remove();
                    this.entriesChecked = this.entriesChecked.filter((e) => e !== ec);
                    this.profiles = this.profiles.filter((p, i) => {
                        return ec !== (p as any).entryClass;
                    });
                    Page.validateButtons();

                }
                
            });
            
        }
        
        let addBtns: any = $(`.${this.idPrefix}-add-entry-btn`);
        for(let btn of addBtns) {
            $(btn).on("click", () => {
                modal.modal('show');
                
            });
            

        }

        Page.validateButtons();
        
    }

    static setEntries(data: Profile[]) {
        $(".date-year").text(new Date().getFullYear());

        let container = $(`#${this.idPrefix}-entries`);
        Page.setContainer(
            container,
            "#_template-profile-entry-label",
            data,
            (c, t, e) => {
                let entryClass = `entry-${data.indexOf(e)}`;
                t.addClass(entryClass);
                let checkbox: any = t.find(".checkbox");
                checkbox.checkbox({
                    onChange: () => {
                        let checked = checkbox.checkbox("is checked");
                        let added = Page.entriesChecked.includes(entryClass);
                        if(checked) {
                            if(!added) Page.entriesChecked.push(entryClass);

                        } else if(added)
                            Page.entriesChecked = Page.entriesChecked.filter(
                                (e) => e !== entryClass);

                        Page.validateButtons();
                    }
                })
                t.find(".text").text(e.fullName);
                let content = Page.getTemplate("#_template-profile-entry-content");
                content.addClass(entryClass);
                Page.setEntry(content, e);
                c.append(content);

            }
        )

    }

    static validateButtons() {
        let btns = $(`.${this.idPrefix}-remove-entry-btn`);
        let disabled = this.entriesChecked.length === 0;
        for(let btn of btns) {
            if(disabled) $(btn).addClass("disabled");
            else $(btn).removeClass("disabled");

        }

        btns = $(`.${this.idPrefix}-toggle-check-btn`);
        disabled = this.profiles.length === 0;
        for(let btn of btns) {
            if(disabled) $(btn).addClass("disabled");
            else $(btn).removeClass("disabled");

        }

    }

    static setEntry(entry: JQuery<HTMLElement>, profile: Profile) {
        for(let key of [
            "givenName",
            "middleName",
            "familyName",
            "gender",
            "sex",
            "civilStatus",
            "religion",
        ]) {
            let id = [this.idPrefix, key].join("-").toLowerCase();
            entry.find(`.${id}`).text((profile as any)[key]);

        }
        
        // Birthdate
        entry.find(`.${Page.idPrefix}-birthdate`).text(
            dateFormat(profile.birthdate, "mmmm d, yyyy"));

        // Height
        entry.find(`.${Page.idPrefix}-height`).text(profile.height);

    }

    static getTemplate(id: string) {
        return $(`#_template ${id}`).clone().removeAttr("id");
    
    }

    static setContainer<T>(
        container: JQuery<HTMLElement>,
        entryTemplateId: string,
        entries: T[],
        callback: (container: JQuery<HTMLElement>, entryTemplate: JQuery<HTMLElement>, entry: T) => any) {
        container.empty();
        for(let i = 0; i < entries.length; i++) {
            let entry = entries[i];
            let temp = Page.getTemplate(entryTemplateId);
            container.append(temp);
            if(callback) callback(container, temp, entry);

        }

    }

}

Page.initialize(Page.profiles);