# IMAGOR

This is pet image processing editor project use React.

![Upload screen](img/uploadScreen.jpg)
_Upload screen in first time load webapp_

![Main scree](img/mainScreen.jpg)
_The screen that use almost all the time_

## Feature

Some features still in progress but already appear in this version.

### Upload panel

As the text mention in the image, user can click the white box or drag file from device into the white box to start upload new image.

Note1: _Only **one** file each time drag to upload file._<br />
Note2: _Currently project only support **image/jpeg**, **image/png**, **image/webp**, **image/svg**._

![Upload panel](img/uploadPanel.jpg)
_Upload box for click or drag to upload file_

Sometime you may want to cancel upload file. Fortunately, current version of project can detect this event so that user can upload again without reload page.

### Topbar

This bar will demonstrate all image available at this time.

From the left side:

- Temporary logo for imagor project. (may change in the future)
- Several tags for changing workplace between different image.
- Several buttons for opening menu or changing mode.

#### Export button (Ctrl + Shift + E)

This button will open export menu for rendering image. Currently this feature is still in progress and hopefully done in version 0.6.0

#### Upload button (Ctrl + Shift = U)

This button will open [upload panel](#upload-panel) for upload new image.

#### Full-screen button (Ctrl + Shift + F)

This button will change current image in [main screen](#main-screen) to full screen mode if browser support. Notice that image in full screen mode may display different depend on your browser and you can exist full screen mode with Esc key. (Some browsers do not show how to exit.)

#### Compare butoon

This button still in progress.

#### Setting button (Alt + S)

This button will open setting menu. Currently, setting menu only support change color of theme with 4 color.

![Topbar](img/topbar.jpg)
_Topbar for change image and open menu_

Top bar contain all workplace of project.

### Toolbar

This bar will have tools at least after version 1.0.0 release.

### Main screen

Main display of image for each workplaces. It automatically update image base on applying filters.

![Main screen](img/mainArea.jpg)
_<span>Photo by <a href="https://unsplash.com/@agent_illustrateur?utm_source=unsplash&amp;utm_medium=referral&amp;utm_content=creditCopyText">Christine Roy</a> on <a href="https://unsplash.com/s/photos/map?utm_source=unsplash&amp;utm_medium=referral&amp;utm_content=creditCopyText">Unsplash</a></span>_

### Option bar

As its name, this bar have several filters for helping user custom image from the most basic element.

#### Histogram

This is an extremely cool thing which show intensity of each color (Red, Green, Blue) from shadow, mid-tone and highlight. Using rechart.js to visualize data and transform y-axis to get more friendly chart.

Note1: _In 1 bit depth image imagor may crash when try to show histogram._

#### Filter

When move the mouse to name of each filters user will get small explain about this filter. The slider in the bottom of each filters can move pretty smooth which will trigger [main screen](#main-screen) to update its image. The number on the right of filter's name not only show current value of slider but also can be modified by click in it. Moreover, by pressing arrow key or scrolling mouse, value in input box will increase or decrease respectively.

![Option bar](img/optionBar.jpg)

Note1: _This bar can resize when hover the area in the middle of main screen and option bar._<br />
Note2: _This bar has a hotkey to toggle open or close which present in [Hotkey section](#Hotkey)_.

### Minimal option bar

To get the maximum area for view image in [main screen](#main-screen), imagor support toggle [option bar](#option-bar) and minimal option bar will show [option bar](#option-bar)'s icon toggle by mouse.

![Minimal option bar](img/minimalBar.jpg)

### Status bar

Most information about image include some metadata will be display in status bar which also has progress bar. Normally, user will always see information show in the left of status bar because this is main element of all image. If image has metadata such as Exif, it will show in the right of status bar.

![Status bar](img/statusBar.jpg)

## Hotkey

| Hotkey               | Purpose                        |
| -------------------- | ------------------------------ |
| **Ctrl + B**         | Toggle option bar              |
| **Ctrl + Shift + F** | Show image in full screen mode |
| **Ctrl + Shift + E** | Show export menu               |
| **Ctrl + Shift + U** | Open upload panel              |
| **Alt + S**          | Open setting menu              |
| **Alt + W**          | Close current tag              |
| **Alt + N**          | Open next tag                  |
| **Alt + P**          | Open previous tag              |
| **Alt + Z**          | Undo filter                    |
| **Alt + Shift + Z**  | Redo filter                    |

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License

[MIT](https://choosealicense.com/licenses/mit/)
