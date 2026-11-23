/**
 * General
 * @author Webcraftic <wordpress.webraftic@gmail.com>
 * @copyright (c) 2020, Webcraftic
 * @version 1.0
 */

(function ($) {

    $(document).on('click', '.wdan-page-restore-notice-link', function () {
        var self = $(this),
            noticeID = $(this).data('notice-id'),
            nonce = $(this).data('nonce'),
            counterEl = $('.wbcr-han-adminbar-counter');

        if (!noticeID) {
            alert('Undefinded error. Please report the bug to our support forum.');
        }

        self.hide();
        self.parent().find('.wdan-page-restore-notice-link-loader').show();


        $.ajax(ajaxurl, {
            type: 'post',
            dataType: 'json',
            data: {
                action: 'wbcr-dan-restore-notice',
                security: nonce,
                notice_id: noticeID
            },
            success: function (response) {
                if (!response || !response.success) {

                    if (response.data.error_message) {
                        self.closest('li').show();
                    } else {
                    }

                    return;
                }

                counterEl.text(counterEl.text() - 1);
                self.closest('tr').hide();
                self.closest('tr').remove();
            },
            error: function (xhr, ajaxOptions, thrownError) {
            }
        });

        return false;
    });

    // Each save rewrites the whole hidden-items list, so overlapping saves would drop each other's item.
    let adminbarSaveQueue = $.Deferred().resolve().promise();

    $('.wdan-checkbox.adminbar-items').change(function() {
        let menuID = $(this).data('menu-id'),
            isChecked = $(this).find('.factory-result').is(":checked"),
            nonce = $(this).data('nonce');

        if( !isChecked ) {
            $('#wp-admin-bar-' + menuID).hide();
        } else {
            $('#wp-admin-bar-' + menuID).show();
        }

        adminbarSaveQueue = adminbarSaveQueue.then(saveAdminbarItem, saveAdminbarItem);

        function saveAdminbarItem() {
            return $.ajax(ajaxurl, {
                type: 'post',
                dataType: 'json',
                data: {
                    action: 'wdan-disable-adminbar-menus',
                    menu_id: menuID,
                    enable_menu: isChecked,
                    _wpnonce: nonce
                },
                success: function(result, textStatus, jqXHR) {
                    var noticeId, successNoticeID;

                    if( !result || !result.success || !result.data ) {
                        noticeId = $.wbcr_factory_templates_134.app.showNotice(
                            result && result.data && result.data.error_message ? result.data.error_message : $('<span></span>').text('Error: [Unexpected response] Status: [' + jqXHR.status + ']'),
                            'danger'
                        );
                        setTimeout(function() {
                            $.wbcr_factory_templates_134.app.hideNotice(noticeId);
                        }, 5000);

                        return;
                    }

                    successNoticeID = $.wbcr_factory_templates_134.app.showNotice(result.data.success_message, 'success');
                    setTimeout(function() {
                        $.wbcr_factory_templates_134.app.hideNotice(successNoticeID);
                    }, 2000);

                },
                error: function(xhr, ajaxOptions, thrownError) {

                    var errorText = 'Error: [' + thrownError + '] Status: [' + xhr.status + '] Error massage: [' + xhr.responseText + ']';

                    $.wbcr_factory_templates_134.app.showNotice($('<span></span>').text(errorText), 'danger');
                }
            });
        }

    });

})(jQuery);
